export const API_BASE_URL = '/api';

export const ALERT_LEVELS = {
  NORMAL: 'NORMAL',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
};

export const ROLES = {
  USER: 'ROLE_USER',
  DOCTOR: 'ROLE_DOCTOR',
  ADMIN: 'ROLE_ADMIN',
};

export const TIME_RANGES = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '3 months', value: '3m' },
  { label: '6 months', value: '6m' },
  { label: '1 year', value: '1y' },
  { label: 'Custom range', value: 'custom' },
];
