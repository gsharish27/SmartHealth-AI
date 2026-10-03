export function exportRecordsToCSV(records, filename = 'health_records.csv') {
  if (!records || !records.length) return;

  const headers = [
    'Date & Time',
    'Heart Rate (BPM)',
    'Blood Pressure (mmHg)',
    'SpO2 (%)',
    'Glucose (mg/dL)',
    'Temperature (°C)',
    'Weight (kg)',
    'Sleep (hrs)',
    'Steps',
    'Notes'
  ];

  const rows = records.map(r => [
    `"${r.recordedAt || ''}"`,
    r.heartRate || '',
    `"${r.bloodPressureFormatted || ''}"`,
    r.spo2 || '',
    r.bloodGlucose || '',
    r.bodyTemperature || '',
    r.weightKg || '',
    r.sleepHours || '',
    r.steps || '',
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
