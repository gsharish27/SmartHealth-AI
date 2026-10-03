-- Flyway Migration V2: Seed Data for Health Monitoring System

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_USER', 'Standard Patient / End User Access'),
(2, 'ROLE_DOCTOR', 'Medical Doctor / Physician Access'),
(3, 'ROLE_ADMIN', 'System Administrator Access');

-- 2. Insert Users (Password for all accounts is: Password123!)
-- BCrypt hash for "Password123!": $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0m1bXT9qB.rB1C
INSERT INTO users (id, email, password_hash, full_name, phone_number, avatar_url, is_active, created_at) VALUES
(1, 'john.doe@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0m1bXT9qB.rB1C', 'John Doe', '+1 (555) 234-5678', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', true, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 'dr.smith@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0m1bXT9qB.rB1C', 'Dr. Sarah Smith, MD', '+1 (555) 876-5432', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250', true, CURRENT_TIMESTAMP - INTERVAL '60 days'),
(3, 'admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0m1bXT9qB.rB1C', 'System Administrator', '+1 (555) 000-1122', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', true, CURRENT_TIMESTAMP - INTERVAL '90 days'),
(4, 'emily.watson@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0m1bXT9qB.rB1C', 'Emily Watson', '+1 (555) 345-6789', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', true, CURRENT_TIMESTAMP - INTERVAL '15 days');

-- 3. Assign User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- John Doe -> USER
(2, 2), -- Dr. Sarah Smith -> DOCTOR
(3, 3), -- System Admin -> ADMIN
(4, 1); -- Emily Watson -> USER

-- 4. Health Profiles
INSERT INTO health_profiles (id, user_id, date_of_birth, gender, blood_group, height_cm, weight_kg, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, allergies, medical_history) VALUES
(1, 1, '1988-06-14', 'Male', 'O+', 178.5, 75.2, 'Mary Doe', 'Spouse', '+1 (555) 999-8877', 'Penicillin, Peanuts', 'Mild hypertension (controlled), Seasonal asthma'),
(2, 4, '1992-11-20', 'Female', 'A+', 165.0, 61.5, 'David Watson', 'Brother', '+1 (555) 888-7766', 'Dust Mites, Latex', 'No major chronic conditions');

-- 5. Doctors
INSERT INTO doctors (id, user_id, specialty, license_number, hospital_affinity, bio, rating, experience_years) VALUES
(1, 2, 'Cardiology & Internal Medicine', 'MD-948201', 'St. Jude Memorial Hospital', 'Board certified cardiologist specializing in preventative cardiovascular monitoring, blood pressure management, and digital health technology.', 4.95, 14);

-- 6. Doctor Patient Access
INSERT INTO doctor_patient_access (id, doctor_id, patient_id, granted_at, is_active, notes) VALUES
(1, 1, 1, CURRENT_TIMESTAMP - INTERVAL '20 days', true, 'Primary Care Cardiovascular Monitoring'),
(2, 1, 4, CURRENT_TIMESTAMP - INTERVAL '10 days', true, 'Annual Health Checkup & Routine Vitals Review');

-- 7. Seed Health Records (Multiple historical data points over the last 14 days for realistic trend lines)
INSERT INTO health_records (user_id, heart_rate, systolic_bp, diastolic_bp, spo2, blood_glucose, body_temperature, weight_kg, height_cm, sleep_hours, steps, notes, recorded_at) VALUES
-- John Doe (User 1) Records
(1, 74, 122, 80, 98, 95.0, 36.6, 75.8, 178.5, 7.5, 8420, 'Morning checkup, felt well rested.', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(1, 72, 120, 78, 99, 92.5, 36.5, 75.6, 178.5, 8.0, 9150, 'Post-workout measurement.', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(1, 78, 125, 82, 97, 102.0, 36.7, 75.5, 178.5, 6.5, 7200, 'Slightly high glucose after lunch.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(1, 70, 118, 76, 98, 89.0, 36.4, 75.3, 178.5, 7.8, 10400, 'Evening walk completed.', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(1, 75, 121, 79, 98, 94.0, 36.6, 75.2, 178.5, 7.2, 8900, 'Normal routine monitoring.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(1, 88, 138, 92, 95, 135.0, 37.1, 75.3, 178.5, 5.5, 6100, 'High stress day, elevated BP.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 76, 123, 81, 98, 96.0, 36.6, 75.2, 178.5, 7.4, 9800, 'Felt back to normal today.', CURRENT_TIMESTAMP - INTERVAL '1 days'),
(1, 72, 119, 78, 99, 91.0, 36.5, 75.0, 178.5, 8.1, 10250, 'Optimal vital signs reading.', CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- 8. Seed Medications
INSERT INTO medications (id, user_id, name, dosage, frequency, start_date, end_date, prescribed_by, status, notes) VALUES
(1, 1, 'Lisinopril', '10 mg', 'Once Daily (Morning)', CURRENT_DATE - INTERVAL '60 days', NULL, 'Dr. Sarah Smith', 'ACTIVE', 'Take with water before breakfast for blood pressure control.'),
(2, 1, 'Omega-3 Fish Oil', '1000 mg', 'Twice Daily', CURRENT_DATE - INTERVAL '90 days', NULL, 'Self-prescribed', 'ACTIVE', 'Cardiovascular dietary supplement.'),
(3, 1, 'Amoxicillin', '500 mg', 'Every 8 Hours', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '35 days', 'Dr. Sarah Smith', 'COMPLETED', 'Finished 10-day course for dental procedure.');

-- 9. Seed Medication Schedules
INSERT INTO medication_schedules (id, medication_id, scheduled_time, status, taken_at, notes) VALUES
(1, 1, CURRENT_TIMESTAMP + INTERVAL '9 hours', 'PENDING', NULL, 'Morning dose'),
(2, 2, CURRENT_TIMESTAMP + INTERVAL '9 hours', 'PENDING', NULL, 'Morning dose'),
(3, 2, CURRENT_TIMESTAMP + INTERVAL '21 hours', 'PENDING', NULL, 'Evening dose'),
(4, 1, CURRENT_TIMESTAMP - INTERVAL '15 hours', 'TAKEN', CURRENT_TIMESTAMP - INTERVAL '14 hours 50 minutes', 'Taken on time'),
(5, 2, CURRENT_TIMESTAMP - INTERVAL '15 hours', 'TAKEN', CURRENT_TIMESTAMP - INTERVAL '14 hours 45 minutes', 'Taken on time');

-- 10. Seed Appointments
INSERT INTO appointments (id, patient_id, doctor_id, doctor_name, hospital_name, appointment_date, reason, status, doctor_notes) VALUES
(1, 1, 1, 'Dr. Sarah Smith, MD', 'St. Jude Memorial Hospital - Cardiology Suite 402', CURRENT_TIMESTAMP + INTERVAL '3 days', 'Quarterly Cardiovascular Follow-up & BP Monitoring Check', 'UPCOMING', NULL),
(2, 1, 1, 'Dr. Sarah Smith, MD', 'St. Jude Memorial Hospital - Cardiology Suite 402', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Initial BP Consultation & Medication Adjustment', 'COMPLETED', 'Patient prescribed Lisinopril 10mg daily. Tolerating well.'),
(3, 4, 1, 'Dr. Sarah Smith, MD', 'St. Jude Memorial Hospital - Wellness Wing', CURRENT_TIMESTAMP + INTERVAL '7 days', 'Annual Physical Examination & General Preventive Care', 'UPCOMING', NULL);

-- 11. Seed Health Alerts
INSERT INTO health_alerts (id, user_id, health_record_id, alert_level, metric_type, triggered_value, message, guidance, is_read, created_at) VALUES
(1, 1, 6, 'WARNING', 'BLOOD_PRESSURE', '138/92 mmHg', 'Your latest blood pressure reading is outside your configured monitoring range.', 'We recommend taking a 15-minute rest in a quiet space and repeating your measurement. If readings remain above 140/90 mmHg consistently, please message your physician.', false, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 1, 6, 'WARNING', 'HEART_RATE', '88 BPM', 'Elevated resting heart rate detected during your afternoon check-in.', 'Stay hydrated and check for stressors or caffeine intake. Monitor if this persists during rest.', true, CURRENT_TIMESTAMP - INTERVAL '2 days');

-- 12. Seed Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES
(1, 1, 'Medication Reminder', 'It is time to take Lisinopril 10 mg (Morning Dose).', 'INFO', false, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(2, 1, 'Upcoming Appointment', 'Reminder: You have a scheduled appointment with Dr. Sarah Smith in 3 days.', 'INFO', false, CURRENT_TIMESTAMP - INTERVAL '12 hours');

-- Reset sequences
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('health_profiles_id_seq', (SELECT MAX(id) FROM health_profiles));
SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors));
SELECT setval('doctor_patient_access_id_seq', (SELECT MAX(id) FROM doctor_patient_access));
SELECT setval('health_records_id_seq', (SELECT MAX(id) FROM health_records));
SELECT setval('medications_id_seq', (SELECT MAX(id) FROM medications));
SELECT setval('medication_schedules_id_seq', (SELECT MAX(id) FROM medication_schedules));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
SELECT setval('health_alerts_id_seq', (SELECT MAX(id) FROM health_alerts));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
