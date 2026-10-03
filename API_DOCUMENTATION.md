# Health Monitoring System — REST API Specification

## Base URL
`/api`

---

## Authentication Endpoints

### 1. User Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "id": 1,
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "roles": ["ROLE_USER"]
  }
}
```

### 2. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123!",
  "phoneNumber": "+1555123456",
  "role": "ROLE_USER"
}
```

---

## Dashboard Overview

### `GET /api/dashboard/overview`
Returns user greeting, 8 vital cards with current values, units, statuses, percentage changes, 7-day sparkline arrays, recent alerts, upcoming appointments, and today's medications.

---

## Health Records API

### 1. Get Paginated Records
- **Endpoint**: `GET /api/health-records?page=0&size=20&startDate=...&endDate=...`
- **Response**: Server-paginated health records array with totalPages and totalElements.

### 2. Get Historical Trends
- **Endpoint**: `GET /api/health-records/trends?timeRange=7d`
- **Query Params**: `timeRange` (`7d`, `30d`, `3m`, `6m`, `1y`, `custom`)

### 3. Log New Health Record
- **Endpoint**: `POST /api/health-records`
- **Request Body**:
```json
{
  "heartRate": 74,
  "systolicBp": 120,
  "diastolicBp": 80,
  "spo2": 98,
  "bloodGlucose": 95.0,
  "bodyTemperature": 36.6,
  "weightKg": 75.2,
  "heightCm": 178.5,
  "sleepHours": 8.0,
  "steps": 10250,
  "notes": "Morning checkup rested"
}
```

---

## Medications API

- `GET /api/medications` — List user medications
- `POST /api/medications` — Add prescription
- `POST /api/medications/schedules/{scheduleId}/take` — Log dose as taken

---

## Appointments API

- `GET /api/appointments` — List appointments
- `POST /api/appointments` — Book new appointment

---

## Doctor Portal API (`ROLE_DOCTOR`, `ROLE_ADMIN`)

- `GET /api/doctor/patients` — Search & list granted patients
- `GET /api/doctor/patients/{patientId}/overview` — Comprehensive patient telemetry & trend history
- `POST /api/doctor/access/grant?doctorId=...` — Grant patient access permission

---

## Admin Portal API (`ROLE_ADMIN`)

- `GET /api/admin/metrics` — Platform overview metrics (total users, active users, doctors, records, appointments, uptime)
- `GET /api/admin/users` — Paginated user directory with search
- `PATCH /api/admin/users/{id}/toggle-active` — Lock / Unlock account
- `PATCH /api/admin/users/{id}/role` — Update security authority roles
