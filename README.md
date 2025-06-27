# Myroslav - Baby Feeding Tracker PWA

## About The Project

Myroslav is a Progressive Web Application (PWA) designed to help parents track their baby's feeding schedule. It's a simple and intuitive tool that works offline and can be installed on a mobile device's home screen for easy access.

## Features

*   **Track Feeding Times:** Easily record feeding sessions, including the type of feeding (left breast, right breast, both, or bottle).
*   **Timer:** A built-in timer to accurately measure the duration of each feeding session.
*   **Statistics:** View a history of all feeding sessions to monitor your baby's eating habits.
*   **Edit and Delete:** Correct mistakes by editing or deleting previous feeding records.
*   **Offline Functionality:** The app works offline, so you can record feedings even without an internet connection.
*   **PWA:** Install the app on your phone's home screen for a native-app-like experience.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

*   Docker
*   Docker Compose

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Myroslav.git
    ```
2.  Build and run the Docker containers
    ```sh
    docker-compose up --build
    ```
3.  Open your browser and navigate to `http://localhost:8080`

## Usage

1.  **Start a new feeding session:** Click the "🥛 Молоко" (Milk) button.
2.  **Select the feeding type:** Choose between "Ліва" (Left), "Права" (Right), "Обидві" (Both), or "Пляшечка" (Bottle).
3.  **Timer:** The timer will start automatically. Click the "⏹ Стоп" (Stop) button when the feeding is finished.
4.  **Save the session:** Review the details and click "Зберегти" (Save).
5.  **View statistics:** Click the "📊 Статистика" (Statistics) button to see a list of all recorded feeding sessions.
6.  **Edit or delete a session:** In the statistics view, click the "✏️" icon to edit or delete a specific record.

## Built With

*   [FastAPI](https://fastapi.tiangolo.com/)
*   [Uvicorn](https://www.uvicorn.org/)
*   [Jinja2](https://jinja.palletsprojects.com/en/3.1.x/)
*   [Docker](https://www.docker.com/)
*   [PostgreSQL](https://www.postgresql.org/)
*   [Vanilla JS](http://vanilla-js.com/)