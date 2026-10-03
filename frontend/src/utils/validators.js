import { VITAL_SIGNS_CONFIG } from './constants';

export const validateVitalSigns = (values) => {
  const errors = {};

  if (values.heartRate !== '' && values.heartRate !== null && values.heartRate !== undefined) {
    const hr = Number(values.heartRate);
    if (isNaN(hr) || hr < VITAL_SIGNS_CONFIG.heartRate.min || hr > VITAL_SIGNS_CONFIG.heartRate.max) {
      errors.heartRate = `Heart rate must be between ${VITAL_SIGNS_CONFIG.heartRate.min} and ${VITAL_SIGNS_CONFIG.heartRate.max} BPM`;
    }
  }

  if (values.systolicBp !== '' && values.systolicBp !== null && values.systolicBp !== undefined) {
    const sys = Number(values.systolicBp);
    if (isNaN(sys) || sys < 50 || sys > 250) {
      errors.systolicBp = 'Systolic BP must be between 50 and 250 mmHg';
    }
  }

  if (values.diastolicBp !== '' && values.diastolicBp !== null && values.diastolicBp !== undefined) {
    const dia = Number(values.diastolicBp);
    if (isNaN(dia) || dia < 30 || dia > 150) {
      errors.diastolicBp = 'Diastolic BP must be between 30 and 150 mmHg';
    }
  }

  if (values.systolicBp && values.diastolicBp && Number(values.systolicBp) <= Number(values.diastolicBp)) {
    errors.systolicBp = 'Systolic pressure must be greater than diastolic pressure';
  }

  if (values.spo2 !== '' && values.spo2 !== null && values.spo2 !== undefined) {
    const spo2 = Number(values.spo2);
    if (isNaN(spo2) || spo2 < VITAL_SIGNS_CONFIG.spo2.min || spo2 > VITAL_SIGNS_CONFIG.spo2.max) {
      errors.spo2 = `SpO2 must be between ${VITAL_SIGNS_CONFIG.spo2.min}% and ${VITAL_SIGNS_CONFIG.spo2.max}%`;
    }
  }

  if (values.bloodGlucose !== '' && values.bloodGlucose !== null && values.bloodGlucose !== undefined) {
    const bg = Number(values.bloodGlucose);
    if (isNaN(bg) || bg < VITAL_SIGNS_CONFIG.bloodGlucose.min || bg > VITAL_SIGNS_CONFIG.bloodGlucose.max) {
      errors.bloodGlucose = `Blood glucose must be between ${VITAL_SIGNS_CONFIG.bloodGlucose.min} and ${VITAL_SIGNS_CONFIG.bloodGlucose.max} mg/dL`;
    }
  }

  if (values.temperature !== '' && values.temperature !== null && values.temperature !== undefined) {
    const temp = Number(values.temperature);
    if (isNaN(temp) || temp < VITAL_SIGNS_CONFIG.temperature.min || temp > VITAL_SIGNS_CONFIG.temperature.max) {
      errors.temperature = `Temperature must be between ${VITAL_SIGNS_CONFIG.temperature.min}°C and ${VITAL_SIGNS_CONFIG.temperature.max}°C`;
    }
  }

  if (values.weight !== '' && values.weight !== null && values.weight !== undefined) {
    const weight = Number(values.weight);
    if (isNaN(weight) || weight < VITAL_SIGNS_CONFIG.weight.min || weight > VITAL_SIGNS_CONFIG.weight.max) {
      errors.weight = `Weight must be between ${VITAL_SIGNS_CONFIG.weight.min} and ${VITAL_SIGNS_CONFIG.weight.max} kg`;
    }
  }

  if (!values.recordedAt) {
    errors.recordedAt = 'Recorded date and time is required';
  }

  return errors;
};
