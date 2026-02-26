## FullStack Property Listings App

This project is a **full‑stack web application** for managing and browsing property listings, built with a **Django REST API backend** and a **React + TypeScript + Vite frontend**.

### Tech Stack

- **Backend**: Django 6, Django REST Framework, JWT auth, optional PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, MUI, Leaflet

### Prerequisites (any OS)

- **Node.js** (recommended **18+**) and **npm**
- **Python** **3.10+** and **pip**
- (Optional) **PostgreSQL** if you configure the project to use it instead of SQLite

---

### 1. Backend Setup & Run (Django)

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows (PowerShell): .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Apply migrations and start the server
python manage.py migrate
python manage.py runserver         # http://127.0.0.1:8000/
```

If you use PostgreSQL or another database, configure it in `backend/settings.py` or your environment before running migrations.

---

### 2. Frontend Setup & Run (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev                        # default: http://127.0.0.1:5173/
```

---

### 3. Running the Full Stack

- **Terminal 1**: start the **backend** (`python manage.py runserver` in `backend`).
- **Terminal 2**: start the **frontend** (`npm run dev` in `frontend`).
- Open the frontend URL in your browser and it will communicate with the Django API running locally.

