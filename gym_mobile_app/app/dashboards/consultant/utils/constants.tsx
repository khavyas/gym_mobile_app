// API Configuration
export const API_BASE_URL = 'https://api.yourgymapp.com';

export const API_ENDPOINTS = {
  CONSULTANTS: '/consultants',
  APPOINTMENTS: '/appointments',
  STATS: '/stats',
  UPLOAD: '/upload',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  CLIENTS: '/clients',
  NOTIFICATIONS: '/notifications',
  PAYMENTS: '/payments',
} as const;

// Training and Service Modes
export const TRAINING_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

export const SERVICE_TYPES = [
  { value: 'fitness', label: 'Fitness Training' },
  { value: 'nutrition', label: 'Nutrition Consultation' },
  { value: 'yoga', label: 'Yoga Sessions' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'cardio', label: 'Cardio Training' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'wellness', label: 'Wellness Coaching' },
] as const;

// Appointment and Status Management
export const APPOINTMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#F59E0B' },
  { value: 'confirmed', label: 'Confirmed', color: '#10B981' },
  { value: 'completed', label: 'Completed', color: '#3B82F6' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
  { value: 'rescheduled', label: 'Rescheduled', color: '#8B5CF6' },
  { value: 'no-show', label: 'No Show', color: '#6B7280' },
] as const;

export const APPOINTMENT_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
] as const;

// Experience and Certification Levels
export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'experienced', label: 'Experienced (5-10 years)' },
  { value: 'expert', label: 'Expert (10+ years)' },
] as const;

export const CERTIFICATION_TYPES = [
  { value: 'nasm', label: 'NASM' },
  { value: 'ace', label: 'ACE' },
  { value: 'acsm', label: 'ACSM' },
  { value: 'nsca', label: 'NSCA' },
  { value: 'issa', label: 'ISSA' },
  { value: 'ryt', label: 'RYT (Yoga)' },
  { value: 'nutritionist', label: 'Certified Nutritionist' },
  { value: 'other', label: 'Other' },
] as const;

// Color Palette
export const COLORS = {
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  primaryLight: '#DBEAFE',
  
  success: '#10B981',
  successDark: '#047857',
  successLight: '#D1FAE5',
  
  warning: '#F59E0B',
  warningDark: '#D97706',
  warningLight: '#FEF3C7',
  
  danger: '#EF4444',
  dangerDark: '#DC2626',
  dangerLight: '#FEE2E2',
  
  info: '#3B82F6',
  infoDark: '#1E40AF',
  infoLight: '#DBEAFE',
  
  white: '#FFFFFF',
  black: '#000000',
  
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#374151',
    700: '#111827',
    800: '#1F2937',
    900: '#111827',
  },
  
  background: {
    primary: '#F9FAFB',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
  },
  
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
    white: '#FFFFFF',
  },
  
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// Spacing Scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Time and Date Constants
export const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00'
] as const;

export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
] as const;

// Payment and Pricing
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
} as const;

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
] as const;

export const PRICING_MODELS = [
  { value: 'per_session', label: 'Per Session' },
  { value: 'monthly', label: 'Monthly Package' },
  { value: 'weekly', label: 'Weekly Package' },
  { value: 'custom', label: 'Custom Package' },
] as const;

// Validation Constants
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
  bio: {
    maxLength: 500,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  MAX_FILE_SIZE: 'File size should not exceed 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select an image.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  APPOINTMENT_BOOKED: 'Appointment booked successfully!',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully!',
  PAYMENT_SUCCESSFUL: 'Payment completed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
  DATA_SAVED: 'Data saved successfully!',
} as const;

// Animation Durations
export const ANIMATIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Screen Dimensions and Layout
export const LAYOUT = {
  headerHeight: 60,
  tabBarHeight: 80,
  cardBorderRadius: 12,
  buttonBorderRadius: 8,
  inputBorderRadius: 8,
  avatarSize: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
} as const;

// Notification Types
export const NOTIFICATION_TYPES = [
  { value: 'appointment_reminder', label: 'Appointment Reminders' },
  { value: 'new_booking', label: 'New Bookings' },
  { value: 'cancellation', label: 'Cancellations' },
  { value: 'payment', label: 'Payment Updates' },
  { value: 'promotional', label: 'Promotional Offers' },
] as const;

// Export type definitions for better TypeScript support
export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type TrainingMode = typeof TRAINING_MODES[number]['value'];
export type ServiceType = typeof SERVICE_TYPES[number]['value'];
export type AppointmentStatus = typeof APPOINTMENT_STATUSES[number]['value'];
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]['value'];
export type CertificationType = typeof CERTIFICATION_TYPES[number]['value'];
export type PaymentMethod = typeof PAYMENT_METHODS[number]['value'];
export type PricingModel = typeof PRICING_MODELS[number]['value'];
export type NotificationType = typeof NOTIFICATION_TYPES[number]['value'];