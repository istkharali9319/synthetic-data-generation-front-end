# SynthIQ React Frontend

React frontend for the SynthIQ synthetic data generation platform.

This project is the UI layer for the FastAPI backend in:

- Backend repo: `https://github.com/istkharali9319/synthetic-data-generation-back-end`

Frontend repo:

- `https://github.com/istkharali9319/synthetic-data-generation-front-end`

## Overview

This application provides a full browser-based workspace for:

1. Login and workspace access
2. Dashboard metrics and pipeline visibility
3. Synthetic data preview and generation job creation
4. Dataset library browsing and export actions
5. Reports and review queue visibility

The UI is built with React, React Router, and Vite, and it connects to the FastAPI backend over REST APIs.

## Tech stack

- React 18
- React Router DOM
- Vite
- Plain CSS
- Fetch API for backend calls

## Project structure

```text
synthetic-data-generation-front-end/
├── src/
│   ├── api/
│   │   ├── client.js
│   │   └── synthiq.js
│   ├── components/
│   │   ├── AsyncState.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── WorkspaceLayout.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── DatasetsPage.jsx
│   │   ├── GeneratorPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── ReportsPage.jsx
│   ├── styles/
│   │   └── app.css
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Application flow

### Home

- Entry page for the product
- Links users into the live workspace

### Login

- Accepts:
  - email
  - password
  - role
- Calls the backend login API
- Stores returned session data in local storage through `AuthContext`
- Redirects authenticated users into the protected workspace

### Dashboard

- Fetches summary metrics from the backend
- Fetches pipeline snapshot data
- Displays the operational overview after login

### Generator

- Sends generator form data to preview API
- Displays generated preview output and quality notes
- Creates generation job records
- Creates draft dataset records tied to the logged-in user

### Datasets

- Lists dataset records from the backend
- Allows export action for approved datasets
- Shows owner, status, export state, and updated time

### Reports

- Fetches compliance summary
- Fetches review queue
- Displays privacy, bias, drift, and review status information

## Routing

Defined in [src/App.jsx](/Users/istkhar/Projects/HTML/synthetic-data-generation-front-end/src/App.jsx):

- `/` → Home page
- `/login` → Login page
- `/workspace/dashboard` → Dashboard
- `/workspace/generator` → Generator
- `/workspace/datasets` → Dataset library
- `/workspace/reports` → Reports

Protected workspace routes are guarded by:

- [src/components/ProtectedRoute.jsx](/Users/istkhar/Projects/HTML/synthetic-data-generation-front-end/src/components/ProtectedRoute.jsx)

## API integration

The API client is defined in:

- [src/api/client.js](/Users/istkhar/Projects/HTML/synthetic-data-generation-front-end/src/api/client.js)
- [src/api/synthiq.js](/Users/istkhar/Projects/HTML/synthetic-data-generation-front-end/src/api/synthiq.js)

Base API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8005/api/v1
```

Available frontend API integrations:

- `POST /auth/login`
- `GET /dashboard/summary`
- `GET /dashboard/pipelines`
- `POST /generator/preview`
- `POST /generator/jobs`
- `GET /generator/jobs`
- `GET /datasets`
- `POST /datasets`
- `POST /datasets/{id}/export`
- `GET /reports/summary`
- `GET /reports/review-queue`

## Authentication state

Authentication is managed in:

- [src/context/AuthContext.jsx](/Users/istkhar/Projects/HTML/synthetic-data-generation-front-end/src/context/AuthContext.jsx)

The app stores the backend login response in local storage under:

- `synthiq-auth`

Stored data includes:

- `user_id`
- `access_token`
- `full_name`
- `email`
- `role`

## Setup instructions

### 1. Clone the frontend repository

```bash
git clone https://github.com/istkharali9319/synthetic-data-generation-front-end.git
cd synthetic-data-generation-front-end
```

Or use the local folder:

```bash
cd /Users/istkhar/Projects/HTML/synthetic-data-generation-front-end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Default value:

```env
VITE_API_BASE_URL=http://127.0.0.1:8005/api/v1
```

If the backend runs on another host or port, update this value.

### 4. Start the frontend

```bash
npm run dev -- --host 127.0.0.1
```

Vite will choose an available port automatically if the default is already occupied.

### 5. Build for production

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

## Backend connection steps

Before using the frontend, make sure the FastAPI backend is ready.

### Backend checklist

1. PostgreSQL is running
2. Backend dependencies are installed
3. `.env` is configured in the backend repo
4. Database has been seeded
5. FastAPI is running on `127.0.0.1:8005`

Backend start command:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8005 --reload
```

Backend docs:

- `http://127.0.0.1:8005/docs`

## Demo login

Use the seeded backend account:

- Email: `analyst@synthiq.ai`
- Password: `Password@123`
- Role: `Analyst`

Additional seeded users:

- `engineer@synthiq.ai` / `Password@123` / `ML Engineer`
- `reviewer@synthiq.ai` / `Password@123` / `Compliance Reviewer`

## Styling

Primary shared styles are in:

- [src/styles/app.css](/Users/istkhar/Projects/HTML/synthetic-data-generation-front-end/src/styles/app.css)

The UI keeps the visual direction of the original static module while using fully dynamic React pages.

## Troubleshooting

### Login request blocked by CORS

Check:

- backend is running
- backend CORS config includes the frontend origin
- `VITE_API_BASE_URL` points to the correct backend

### API requests fail

Check:

- backend server is up on `8005`
- database is seeded
- browser console for failed route names

### Frontend opens but pages are empty

Check:

- user is logged in
- backend APIs return data
- local storage contains `synthiq-auth`

### Port already in use

Start dev server without forcing a single fixed port:

```bash
npm run dev -- --host 127.0.0.1
```

## Development notes

- `ProtectedRoute` prevents unauthenticated access to workspace pages
- `WorkspaceLayout` provides sidebar navigation and logout
- `AsyncState` renders loading and error placeholders
- `formatters.js` contains shared UI formatting helpers

## Future improvements

- Add token-aware request headers for protected backend endpoints
- Add form validation helpers
- Add dataset details and edit screens
- Add report filters and pagination
- Add unit tests and integration tests
