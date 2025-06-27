document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const mainScreen = document.getElementById('main-screen');
    const typeScreen = document.getElementById('type-screen');
    const timerScreen = document.getElementById('timer-screen');
    const saveScreen = document.getElementById('save-screen');
    const statsScreen = document.getElementById('stats-screen');
    const editScreen = document.getElementById('edit-screen');

    const milkBtn = document.getElementById('milk-btn');
    const statsBtn = document.getElementById('stats-btn');
    const typeBtns = document.querySelectorAll('.type-btn');
    const stopBtn = document.getElementById('stop-btn');
    const saveForm = document.getElementById('save-form');
    const editForm = document.getElementById('edit-form');
    const deleteBtn = document.getElementById('delete-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const cancelBtns = document.querySelectorAll('.cancel-btn');

    const saveTypeBtn = document.getElementById('save-type-btn');

    let timerInterval;
    let startTime;
    let currentType = 'left'; // Default type
    let records = JSON.parse(localStorage.getItem('feedingRecords')) || [];

    function showScreen(screen) {
        screens.forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    milkBtn.addEventListener('click', () => showScreen(typeScreen));
    statsBtn.addEventListener('click', () => {
        loadStatistics();
        showScreen(statsScreen);
    });

    backBtns.forEach(btn => btn.addEventListener('click', () => showScreen(mainScreen)));
    cancelBtns.forEach(btn => btn.addEventListener('click', () => showScreen(mainScreen)));

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentType = btn.dataset.type;
            startFeeding(currentType);
        });
    });

    function startFeeding(type) {
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
        showScreen(timerScreen);
    }

    function updateTimer() {
        const now = new Date();
        const diff = now - startTime;
        const minutes = String(Math.floor(diff / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }

    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 60000);
        
        saveForm.type.value = currentType;
        saveForm.duration.value = duration;
        saveForm.date.value = startTime.toISOString().split('T')[0];
        const hours = String(startTime.getHours()).padStart(2, '0');
        const minutes = String(startTime.getMinutes()).padStart(2, '0');
        saveForm.time.value = `${hours}:${minutes}`;

        const amountGroup = document.getElementById('amount-group');
        if (currentType === 'bottle') {
            amountGroup.style.display = 'block';
        } else {
            amountGroup.style.display = 'none';
        }
        
        showScreen(saveScreen);
    });

    saveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRecord = {
            type: saveForm.type.value,
            duration: parseInt(saveForm.duration.value),
            date: saveForm.date.value,
            time: saveForm.time.value,
            timestamp: new Date(`${saveForm.date.value}T${saveForm.time.value}`).getTime()
        };
        if (newRecord.type === 'bottle') {
            newRecord.amount = parseInt(saveForm.amount.value);
        }
        records.push(newRecord);
        saveRecords();
        showScreen(mainScreen);
    });

    function saveRecords() {
        records.sort((a, b) => b.timestamp - a.timestamp);
        localStorage.setItem('feedingRecords', JSON.stringify(records));
    }

    function loadStatistics() {
        const statsList = document.getElementById('stats-list');
        statsList.innerHTML = '';
        records.forEach((record, index) => {
            const li = document.createElement('li');
            let content = `<span>${record.date} ${record.time} - ${record.type} (${record.duration} хв)</span>`;
            if (record.type === 'bottle') {
                content = `<span>${record.date} ${record.time} - ${record.type} (${record.amount} мл)</span>`;
            }
            li.innerHTML = `${content}<button data-index="${index}">✏️</button>`;
            li.querySelector('button').addEventListener('click', (e) => {
                editFeeding(e.target.dataset.index);
            });
            statsList.appendChild(li);
        });
    }

    function editFeeding(index) {
        const record = records[index];
        editForm['edit-index'].value = index;
        editForm['edit-type'].value = record.type;
        editForm['edit-duration'].value = record.duration;
        editForm['edit-date'].value = record.date;
        editForm['edit-time'].value = record.time;

        const editAmountGroup = document.getElementById('edit-amount-group');
        if (record.type === 'bottle') {
            editAmountGroup.style.display = 'block';
            editForm['edit-amount'].value = record.amount || '';
        } else {
            editAmountGroup.style.display = 'none';
        }

        showScreen(editScreen);
    }

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(editForm['edit-index'].value);
        records[index] = {
            type: editForm['edit-type'].value,
            duration: parseInt(editForm['edit-duration'].value),
            date: editForm['edit-date'].value,
            time: editForm['edit-time'].value,
            timestamp: new Date(`${editForm['edit-date'].value}T${editForm['edit-time'].value}`).getTime()
        };
        if (records[index].type === 'bottle') {
            records[index].amount = parseInt(editForm['edit-amount'].value);
        }
        saveRecords();
        loadStatistics();
        showScreen(statsScreen);
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
            const index = parseInt(editForm['edit-index'].value);
            records.splice(index, 1);
            saveRecords();
            loadStatistics();
            showScreen(statsScreen);
        }
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => console.error('Service worker registration failed:', err));
    }
});
