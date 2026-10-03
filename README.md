# 🏥 Health Monitoring System — Commercial SaaS Web Application

A premium, modern, high-performance **Health Monitoring System** full-stack SaaS application built with **Spring Boot 3.2**, **PostgreSQL**, **Flyway**, **Spring Security JWT**, and **React (JavaScript / JSX only - NO TypeScript)** with **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Key Features & Highlights

- **Premium Healthcare SaaS UI**: Modern dashboard with greeting banners, soft shadows, subtle micro-interactions, dark/light mode toggle, skeleton loaders, and empty states.
- **8 Daily Vital Cards**:
  - ❤️ Heart Rate (BPM)
  - 🩸 Blood Pressure (systolic & diastolic mmHg)
  - 🫁 Oxygen Saturation (SpO2 %)
  - 🩸 Blood Glucose (mg/dL)
  - ⚖️ Body Weight (kg)
  - 🌡️ Temperature (°C)
  - 😴 Sleep Duration (hrs)
  - 🚶 Daily Steps Count
  - *Each card features current value, status pill, percentage change, time-ago text, and 7-day sparkline charts.*
- **Interactive Recharts Analytics**: Multi-metric trend graphs with date range filtering (7d, 30d, 3m, 6m, 1y, custom range).
- **Server-Side Pagination & Filtering**: High-performance backend queries preventing massive data payloads.
- **Automated Threshold Alert Center**: Non-diagnostic safety alerts with recommended clinical guidance.
- **Medication Management**: Dosage tracking, schedule logs, and "Mark as Taken" action.
- **Appointment Management**: Doctor booking and visit status tracking.
- **Role-Based Portals**:
  - **Patient Dashboard**: Personal vital telemetry & records.
  - **Doctor Portal**: Multi-patient clinical overview (access restricted to granted patients).
  - **Admin Portal**: User directory management, account locking, role assignment, and platform metrics.
- **Docker Compose Setup**: Containerized PostgreSQL, Spring Boot backend, and Nginx React frontend.

---

## 🛠️ Technology Stack

### Backend
- Java 17+
- Spring Boot 3.2.4
- Spring Security + JWT Authentication (HMAC-SHA512)
- Spring Data JPA + Hibernate
- PostgreSQL 16 + Flyway Migrations
- Lombok
- Bean Validation (`jakarta.validation`)
- OpenAPI 3.0 / Swagger UI (`/swagger-ui.html`)
- JUnit 5 & Mockito Tests

### Frontend
- React 18 (**JavaScript / JSX ONLY — NO TypeScript**)
- Vite 5 (Production code-splitting with `React.lazy()` & `Suspense`)
- Tailwind CSS 3.4 (Custom theme variables & light/dark mode)
- Recharts 2.12 (Interactive trend charts & sparklines)
- Lucide React (Commercial Healthcare Visual Language)
- React Router v6
- TanStack Query v5 (Smart API Caching & Garbage Collection)
- Axios (JWT Request & Response Interceptors)

---

## 🔑 Demo Login Accounts

All default accounts have password: `Password123!`

| Role | Email | Capabilities |
| :--- | :--- | :--- |
| **Patient / User** | `john.doe@example.com` | Personal Dashboard, Log Vitals, Medications, Appointments, Analytics |
| **Doctor / Physician** | `dr.smith@example.com` | Doctor Portal, Patient Roster, Clinical Overviews |
| **Administrator** | `admin@example.com` | System Admin Portal, User Management, Role Assignments, System Metrics |

---

## 🐳 Docker Setup Instructions

Run the complete full-stack application using a single command:

```bash
docker compose up --build
```

### Access URLs:
- **Frontend Application**: `http://localhost` or `http://localhost:5173`
- **Backend API Server**: `http://localhost:8080/api`
- **Swagger API Docs**: `http://localhost:8080/swagger-ui.html`
- **PostgreSQL Database**: `localhost:5432` (`healthdb` / `postgres`)

---

## 💻 Manual Local Development Setup

### 1. Backend Setup
1. Ensure PostgreSQL is running and database `healthdb` is created.
2. Navigate to `backend/`:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. Flyway will automatically execute database migrations (`V1__init_schema.sql` & `V2__seed_data.sql`).

### 2. Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open browser at `http://localhost:5173`.

---

## 🧪 Running Tests

### Backend Unit & Integration Tests:
```bash
cd backend
mvn test
```
