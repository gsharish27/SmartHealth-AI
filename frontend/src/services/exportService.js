export const exportToCSV = (data, filename = 'health_records.csv') => {
  if (!data || !data.length) return;

  const headers = [
    'ID',
    'Recorded At',
    'Heart Rate (BPM)',
    'Systolic BP (mmHg)',
    'Diastolic BP (mmHg)',
    'SpO2 (%)',
    'Blood Glucose (mg/dL)',
    'Temperature (°C)',
    'Weight (kg)',
    'Height (cm)',
    'Notes',
  ];

  const rows = data.map((item) => [
    item.id || '',
    item.recordedAt ? `"${new Date(item.recordedAt).toISOString()}"` : '',
    item.heartRate || '',
    item.systolicBp || '',
    item.diastolicBp || '',
    item.spo2 || '',
    item.bloodGlucose || '',
    item.temperature || '',
    item.weight || '',
    item.height || '',
    item.notes ? `"${item.notes.replace(/"/g, '""')}"` : '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'health_records.json') => {
  if (!data) return;
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
