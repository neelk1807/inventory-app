# Inventory Management System

A full-stack inventory management system built with:

- FastAPI (Python backend)
- React + TypeScript (frontend)
- PostgreSQL (database)
- Docker (containerized environment)

---

## Features

- User authentication (JWT)
- Category management
- Product management
- Sales / order system
- PDF invoice generation
- Dockerized full stack
- pgAdmin database UI

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React + TypeScript + Vite |
| Backend  | FastAPI |
| Database | PostgreSQL |
| DevOps   | Docker + Docker Compose |

---

## Project Structure

- inventory-app/
- │
- ├── backend/
- │ ├── app/
- │ ├── Dockerfile
- │ └── requirements.txt
- │
- ├── frontend/
- │ ├── src/
- │ ├── Dockerfile
- │ └── package.json
- │
- ├── docker-compose.yml
- └── .env

---

## Setup (Docker)

### 1. Clone repository

```bash
git clone https://github.com/your-username/inventory-app.git
cd inventory-app
