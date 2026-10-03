-- Flyway Migration V1: Full Database Schema for Health Monitoring System

-- 1. Roles Table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Roles Junction Table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Health Profiles Table
CREATE TABLE health_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    emergency_contact_name VARCHAR(100),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    allergies TEXT,
    medical_history TEXT,
    target_heart_rate_min INT DEFAULT 60,
    target_heart_rate_max INT DEFAULT 100,
    target_systolic_max INT DEFAULT 120,
    target_diastolic_max INT DEFAULT 80,
    target_spo2_min INT DEFAULT 95,
    target_glucose_max NUMERIC(5,2) DEFAULT 140.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Doctors Table
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    hospital_affinity VARCHAR(150),
    bio TEXT,
    rating NUMERIC(3,2) DEFAULT 4.90,
    experience_years INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Doctor Patient Access Table
CREATE TABLE doctor_patient_access (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    notes VARCHAR(255),
    UNIQUE(doctor_id, patient_id)
);

-- 7. Health Records Table
CREATE TABLE health_records (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    heart_rate INT,                      -- BPM
    systolic_bp INT,                     -- mmHg
    diastolic_bp INT,                    -- mmHg
    spo2 INT,                            -- percentage
    blood_glucose NUMERIC(5,2),          -- mg/dL
    body_temperature NUMERIC(4,2),       -- Celsius
    weight_kg NUMERIC(5,2),              -- kg
    height_cm NUMERIC(5,2),              -- cm
    sleep_hours NUMERIC(4,2),            -- hours
    steps INT,                           -- step count
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Medications Table
CREATE TABLE medications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL, -- e.g., "Twice Daily", "Every 8 Hours"
    start_date DATE NOT NULL,
    end_date DATE,
    prescribed_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, PAUSED
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Medication Schedules Table (Logs & Next Doses)
CREATE TABLE medication_schedules (
    id BIGSERIAL PRIMARY KEY,
    medication_id BIGINT NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, TAKEN, SKIPPED
    taken_at TIMESTAMP WITH TIME ZONE,
    notes VARCHAR(255)
);

-- 10. Appointments Table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(100) NOT NULL,
    hospital_name VARCHAR(150) NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'UPCOMING', -- UPCOMING, COMPLETED, CANCELLED
    doctor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Health Alerts Table
CREATE TABLE health_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    health_record_id BIGINT REFERENCES health_records(id) ON DELETE SET NULL,
    alert_level VARCHAR(20) NOT NULL, -- NORMAL, WARNING, CRITICAL
    metric_type VARCHAR(50) NOT NULL, -- BLOOD_PRESSURE, HEART_RATE, SPO2, GLUCOSE
    triggered_value VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    guidance TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Notifications Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO', -- INFO, WARNING, SUCCESS, ALERT
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for High Performance Queries
CREATE INDEX idx_health_records_user_date ON health_records(user_id, recorded_at DESC);
CREATE INDEX idx_health_alerts_user ON health_alerts(user_id, is_read, created_at DESC);
CREATE INDEX idx_medications_user ON medications(user_id, status);
CREATE INDEX idx_appointments_patient ON appointments(patient_id, appointment_date DESC);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id, appointment_date DESC);
CREATE INDEX idx_doctor_patient_access ON doctor_patient_access(doctor_id, patient_id);
