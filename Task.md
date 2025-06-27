# Myroslav - Baby Feeding Tracker PWA

## Project Overview
Create a Progressive Web Application (PWA) for tracking baby feeding times that works offline on iPhone and can be added to the home screen like a native app.

## Technical Requirements
- **Backend**: FastAPI (Python) serving both API and static files
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Data Storage**: localStorage (Phase 1), PostgreSQL (Phase 2)
- **Deployment**: Docker Compose
- **Port**: 8080
- **Language**: Ukrainian interface

## Application Functionality

### Main Features
1. **Feeding Timer**: Start timer for different feeding types
2. **Data Storage**: Save feeding records locally
3. **Statistics**: View and edit feeding history
4. **PWA Features**: Offline functionality, installable on iPhone

### User Flow
1. **Home Screen**: Two buttons - "Молоко" (Milk) and "Статистика" (Statistics)
2. **Feeding Type Selection**: Four options - "Ліва" (Left), "Права" (Right), "Обидві" (Both), "Пляшечка" (Bottle)
3. **Timer Screen**: Shows running timer with stop button
4. **Save Form**: Edit and save feeding record with date/time
5. **Statistics Screen**: List of all feeding records with edit capability
6. **Edit Screen**: Modify or delete existing records

### Data Structure
Each feeding record contains:
```javascript
{
    type: "left|right|both|bottle",
    duration: number, // minutes
    date: "YYYY-MM-DD",
    time: "HH:MM",
    timestamp: number // for sorting
}
```

## File Structure
```
Myroslav/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── README.md
└── app/
    ├── main.py
    ├── static/
    │   ├── style.css
    │   ├── script.js
    │   └── sw.js
    └── templates/
        └── index.html
```

## Implementation Details

### docker-compose.yml
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:8000"
    volumes:
      - ./app:/app
    environment:
      - DEBUG=1
    restart: unless-stopped
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myroslav_db
      POSTGRES_USER: myroslav_user
      POSTGRES_PASSWORD: myroslav_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
volumes:
  postgres_data:
```

### Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app /app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
jinja2==3.1.2
python-multipart==0.0.6
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
```

### FastAPI Application (app/main.py)
Create FastAPI app that:
- Serves static files from `/static/` directory
- Serves main HTML template at root path `/`
- Provides `/manifest.json` endpoint for PWA manifest
- Serves service worker at `/sw.js`
- Uses Jinja2Templates for template rendering

Key endpoints:
- `GET /` - Serve main application HTML
- `GET /manifest.json` - PWA manifest with app metadata
- `GET /sw.js` - Service worker for offline functionality

### HTML Structure (app/templates/index.html)
Create single-page application with multiple screens:
- Main screen: Two main buttons
- Feeding type screen: Four feeding type buttons
- Timer screen: Timer display and stop button
- Save screen: Form for editing feeding details
- Statistics screen: List of feeding records
- Edit screen: Form for modifying existing records

Include proper PWA meta tags:
- Viewport meta tag for mobile
- Theme color and apple-mobile-web-app tags
- Manifest link

### CSS Styling (app/static/style.css)
Design requirements:
- Mobile-first responsive design
- Modern gradient backgrounds
- Button hover effects and animations
- Clean, user-friendly interface
- Ukrainian color scheme (green primary color #4CAF50)
- Support for PWA display modes
- Safe area handling for iPhone

### JavaScript Functionality (app/static/script.js)
Core features to implement:
1. **Screen Navigation**: Function to switch between different screens
2. **Timer Logic**: Start/stop timer with display updates
3. **Data Management**: Save/load/edit/delete feeding records using localStorage
4. **PWA Registration**: Register service worker
5. **Form Handling**: Populate and validate forms
6. **Event Listeners**: Handle all button clicks and form submissions

Key functions needed:
- `startFeeding(type)` - Begin feeding session
- `stopTimer()` - End feeding and show save form
- `saveFeeding()` - Store feeding record
- `loadStatistics()` - Display feeding history
- `editFeeding(index)` - Edit existing record
- `deleteFeeding()` - Remove record with confirmation

### Service Worker (app/static/sw.js)
Implement offline functionality:
- Cache static resources during install
- Serve cached content when offline
- Clean up old caches on activation

Cache these resources:
- Main HTML page
- CSS and JavaScript files
- PWA manifest

### PWA Manifest
Configure app metadata:
- Name: "Myroslav - Baby Feeding Tracker"
- Icons: 192x192 and 512x512 sizes
- Display mode: standalone
- Theme colors: white background, green theme
- Start URL: root path

## Data Storage Strategy

### Phase 1: localStorage
- Store feeding records as JSON array
- Sort records by timestamp (newest first)
- Handle data parsing and validation
- No server persistence

### Phase 2: PostgreSQL Sync (Future)
- Add API endpoints for CRUD operations
- Implement sync logic in JavaScript
- Handle offline/online state changes
- Conflict resolution for concurrent edits

## User Interface Text (Ukrainian)
- Main buttons: "🥛 Молоко", "📊 Статистика"
- Feeding types: "← Ліва", "Права →", "↔ Обидві", "🍼 Пляшечка"
- Timer button: "⏹ Стоп"
- Form labels: "Тип", "Тривалість", "Початок", "Кінець", "Дата", "Час"
- Action buttons: "Зберегти", "Скасувати", "Видалити"
- Back navigation: "← Назад"

## Testing and Deployment

### Local Development
1. Create project directory structure
2. Run `docker-compose up --build`
3. Access at `http://localhost:8080`

### iPhone Installation
1. Open in Safari on iPhone
2. Tap share button
3. Select "Add to Home Screen"
4. App appears as native application

### Validation Checklist
- ✅ App loads and displays correctly
- ✅ Timer starts and stops properly
- ✅ Data saves to localStorage
- ✅ Statistics display feeding records
- ✅ Edit/delete functionality works
- ✅ PWA installs on iPhone home screen
- ✅ App works offline after first load
- ✅ Service worker caches resources

## Error Handling
- Graceful handling of localStorage errors
- Timer cleanup on page navigation
- Form validation before saving
- Confirmation dialogs for destructive actions

## Performance Considerations
- Minimize JavaScript bundle size
- Optimize CSS for mobile rendering
- Efficient DOM manipulation
- Fast localStorage operations

## Future Enhancements (Phase 2)
- PostgreSQL database integration
- FastAPI CRUD endpoints
- Automatic Wi-Fi sync
- Web interface for statistics
- Data export functionality

---

This document provides complete specifications for recreating the Myroslav baby feeding tracker PWA. All code should be implemented exactly as described to ensure proper functionality and PWA compliance.
