// Fallback Mock Data Engine for when Backend API is offline

export const mockUsers = {
  'john.doe@example.com': {
    token: 'mock-jwt-john-doe',
    tokenType: 'Bearer',
    id: 1,
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    roles: ['ROLE_USER'],
  },
  'dr.smith@example.com': {
    token: 'mock-jwt-dr-smith',
    tokenType: 'Bearer',
    id: 2,
    email: 'dr.smith@example.com',
    fullName: 'Dr. Sarah Smith, MD',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    roles: ['ROLE_DOCTOR'],
  },
  'admin@example.com': {
    token: 'mock-jwt-admin',
    tokenType: 'Bearer',
    id: 3,
    email: 'admin@example.com',
    fullName: 'System Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    roles: ['ROLE_ADMIN'],
  },
};

export const mockDashboardOverview = {
  userName: 'John Doe',
  greeting: 'Good morning, John Doe',
  subhead: "Here's your health overview for today.",
  vitalCards: [
    {
      key: 'heart_rate',
      title: 'Heart Rate',
      icon: 'Heart',
      currentValue: '72',
      unit: 'BPM',
      status: 'Normal',
      changePercentage: '↓ 3% from previous',
      changeDirection: 'DOWN',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [76, 75, 74, 78, 72, 70, 72],
    },
    {
      key: 'blood_pressure',
      title: 'Blood Pressure',
      icon: 'Activity',
      currentValue: '120/80',
      unit: 'mmHg',
      status: 'Normal',
      changePercentage: '↓ 1% from previous',
      changeDirection: 'DOWN',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [124, 122, 125, 121, 123, 119, 120],
    },
    {
      key: 'spo2',
      title: 'SpO2 Oxygen',
      icon: 'Wind',
      currentValue: '98',
      unit: '%',
      status: 'Optimal',
      changePercentage: '↑ 1% from previous',
      changeDirection: 'UP',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [97, 98, 97, 98, 98, 99, 98],
    },
    {
      key: 'glucose',
      title: 'Blood Glucose',
      icon: 'Droplet',
      currentValue: '95.0',
      unit: 'mg/dL',
      status: 'Normal',
      changePercentage: '↓ 2% from previous',
      changeDirection: 'DOWN',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [102, 98, 96, 95, 94, 96, 95],
    },
    {
      key: 'weight',
      title: 'Body Weight',
      icon: 'Scale',
      currentValue: '75.2',
      unit: 'kg',
      status: 'Optimal',
      changePercentage: '↓ 0.4% from previous',
      changeDirection: 'DOWN',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [75.8, 75.6, 75.5, 75.3, 75.2, 75.2, 75.2],
    },
    {
      key: 'temperature',
      title: 'Temperature',
      icon: 'Thermometer',
      currentValue: '36.6',
      unit: '°C',
      status: 'Normal',
      changePercentage: '0% from previous',
      changeDirection: 'FLAT',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [36.5, 36.6, 36.5, 36.7, 36.6, 36.5, 36.6],
    },
    {
      key: 'sleep',
      title: 'Sleep Duration',
      icon: 'Moon',
      currentValue: '8.0',
      unit: 'hrs',
      status: 'Optimal',
      changePercentage: '↑ 10% from previous',
      changeDirection: 'UP',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [6.5, 7.0, 7.5, 6.8, 7.2, 7.8, 8.0],
    },
    {
      key: 'steps',
      title: 'Daily Steps',
      icon: 'Footprints',
      currentValue: '10,250',
      unit: 'steps',
      status: 'Goal Met',
      changePercentage: '↑ 15% from previous',
      changeDirection: 'UP',
      lastUpdatedText: '2 hrs ago',
      sparklineData: [7200, 8400, 9100, 8900, 9800, 10100, 10250],
    },
  ],
  recentAlerts: [
    {
      id: 1,
      alertLevel: 'WARNING',
      metricType: 'BLOOD_PRESSURE',
      triggeredValue: '138/92 mmHg',
      message: 'Your latest blood pressure reading is outside your configured monitoring range.',
      guidance: 'We recommend taking a 15-minute rest in a quiet space and repeating your measurement. If readings remain elevated, contact your physician.',
      createdAt: new Date().toISOString(),
      isRead: false,
    }
  ],
  upcomingAppointments: [
    {
      id: 1,
      doctorName: 'Dr. Sarah Smith, MD',
      hospitalName: 'St. Jude Memorial Hospital - Cardiology Suite 402',
      appointmentDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      reason: 'Quarterly Cardiovascular Follow-up & BP Monitoring Check',
      status: 'UPCOMING',
    }
  ],
  todaysMedications: [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10 mg',
      frequency: 'Once Daily (Morning)',
      startDate: '2026-08-01',
      status: 'ACTIVE',
      schedules: [
        { id: 1, scheduledTime: new Date(Date.now() + 3600000 * 4).toISOString(), status: 'PENDING' }
      ]
    },
    {
      id: 2,
      name: 'Omega-3 Fish Oil',
      dosage: '1000 mg',
      frequency: 'Twice Daily',
      startDate: '2026-07-01',
      status: 'ACTIVE',
      schedules: [
        { id: 2, scheduledTime: new Date(Date.now() + 3600000 * 4).toISOString(), status: 'PENDING' }
      ]
    }
  ]
};

export const mockTrends = [
  { dateLabel: 'Oct 01', heartRate: 74, systolicBp: 122, diastolicBp: 80, spo2: 98, bloodGlucose: 95, weightKg: 75.8, sleepHours: 7.5, steps: 8420 },
  { dateLabel: 'Oct 02', heartRate: 72, systolicBp: 120, diastolicBp: 78, spo2: 99, bloodGlucose: 92.5, weightKg: 75.6, sleepHours: 8.0, steps: 9150 },
  { dateLabel: 'Oct 03', heartRate: 78, systolicBp: 125, diastolicBp: 82, spo2: 97, bloodGlucose: 102, weightKg: 75.5, sleepHours: 6.5, steps: 7200 },
  { dateLabel: 'Oct 04', heartRate: 70, systolicBp: 118, diastolicBp: 76, spo2: 98, bloodGlucose: 89, weightKg: 75.3, sleepHours: 7.8, steps: 10400 },
  { dateLabel: 'Oct 05', heartRate: 75, systolicBp: 121, diastolicBp: 79, spo2: 98, bloodGlucose: 94, weightKg: 75.2, sleepHours: 7.2, steps: 8900 },
  { dateLabel: 'Oct 06', heartRate: 88, systolicBp: 138, diastolicBp: 92, spo2: 95, bloodGlucose: 135, weightKg: 75.3, sleepHours: 5.5, steps: 6100 },
  { dateLabel: 'Oct 07', heartRate: 72, systolicBp: 119, diastolicBp: 78, spo2: 99, bloodGlucose: 91, weightKg: 75.0, sleepHours: 8.1, steps: 10250 },
];

export const mockRecordsPaged = {
  content: [
    {
      id: 1,
      recordedAt: new Date().toISOString(),
      heartRate: 72,
      systolicBp: 119,
      diastolicBp: 78,
      bloodPressureFormatted: '119/78',
      spo2: 99,
      bloodGlucose: 91.0,
      bodyTemperature: 36.5,
      weightKg: 75.0,
      heightCm: 178.5,
      sleepHours: 8.1,
      steps: 10250,
      notes: 'Optimal vital signs reading recorded after morning rest.'
    },
    {
      id: 2,
      recordedAt: new Date(Date.now() - 86400000).toISOString(),
      heartRate: 76,
      systolicBp: 123,
      diastolicBp: 81,
      bloodPressureFormatted: '123/81',
      spo2: 98,
      bloodGlucose: 96.0,
      bodyTemperature: 36.6,
      weightKg: 75.2,
      heightCm: 178.5,
      sleepHours: 7.4,
      steps: 9800,
      notes: 'Evening post-walk measurement.'
    }
  ],
  page: 0,
  size: 10,
  totalElements: 2,
  totalPages: 1,
  last: true
};

export const mockDoctors = [
  {
    id: 1,
    userId: 2,
    fullName: 'Dr. Sarah Smith, MD',
    email: 'dr.smith@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    specialty: 'Cardiology & Internal Medicine',
    licenseNumber: 'MD-948201',
    hospitalAffinity: 'St. Jude Memorial Hospital',
    bio: 'Board certified cardiologist specializing in digital health monitoring.',
    rating: 4.95,
    experienceYears: 14
  }
];

export const mockDoctorPatientsPaged = {
  content: [
    {
      patientId: 1,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1 (555) 234-5678',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      age: 36,
      gender: 'Male',
      bloodGroup: 'O+',
      latestVitals: { heartRate: 72, bloodPressureFormatted: '119/78', spo2: 99 },
      activeAlerts: []
    }
  ],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  last: true
};

export const mockAdminMetrics = {
  totalUsers: 4,
  activeUsers: 4,
  totalDoctors: 1,
  totalHealthRecords: 8,
  totalAppointments: 3,
  totalAlerts: 2,
  criticalAlerts: 0,
  systemUptimePercentage: 99.98
};

export const mockAdminUsersPaged = {
  content: [
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      isActive: true,
      roles: ['ROLE_USER']
    },
    {
      id: 2,
      fullName: 'Dr. Sarah Smith, MD',
      email: 'dr.smith@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
      isActive: true,
      roles: ['ROLE_DOCTOR']
    },
    {
      id: 3,
      fullName: 'System Administrator',
      email: 'admin@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      isActive: true,
      roles: ['ROLE_ADMIN']
    }
  ],
  page: 0,
  size: 10,
  totalElements: 3,
  totalPages: 1,
  last: true
};
