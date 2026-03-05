// ─────────────────────────────────────────────────────────────
//  HiWox Weekly Check-In — Question Config
//  All 9 domains · questions match PDF data points exactly
// ─────────────────────────────────────────────────────────────

export type FieldType = 'scale' | 'number' | 'yesno' | 'dropdown';

export interface CheckInQuestion {
  field: string;
  label: string;
  type: FieldType;
  min?: number;
  max?: number;
  unit?: string;
  lowLabel?: string;
  highLabel?: string;
  options?: string[];
  optional?: boolean;
  invertedScore?: boolean;
}

export interface CheckInDomain {
  id: string;
  label: string;
  icon: string;
  color: string;
  gradientColors: [string, string];
  questions: CheckInQuestion[];
}

export const CHECKIN_DOMAINS: CheckInDomain[] = [

  // ── 1. PHYSICAL WELLNESS (8 data points) ─────────────────
  {
    id: 'physical',
    label: 'Physical',
    icon: '🏃',
    color: '#FF6B6B',
    gradientColors: ['#FF6B6B', '#FF8E53'],
  questions: [
  {
    field: 'physical_weight',
    label: 'Weight & Measurements: What is your current weight?',
    type: 'number',
    min: 30,
    max: 300,
    unit: 'kg',
  },
  {
    field: 'physical_steps',
    label: 'Daily Walking Steps: How many steps do you walk daily on average?',
    type: 'number',
    min: 0,
    max: 50000,
    unit: 'steps',
  },
  {
    field: 'physical_activity',
    label: 'Activity Level: How many times per week do you exercise?',
    type: 'number',
    min: 0,
    max: 14,
    unit: 'sessions',
  },
  {
    field: 'physical_rhr',
    label: 'Vital Signs: What is your typical resting heart rate?',
    type: 'number',
    min: 30,
    max: 200,
    unit: 'bpm',
    invertedScore: true,
  },
  {
    field: 'physical_energy',
    label: 'Vitality: On a scale of 1–10, how would you rate your overall energy level?',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'Very Low',
    highLabel: 'Excellent',
  },
],
  },

  // ── 2. NUTRITIONAL & METABOLIC WELLNESS (8 data points) ──
  {
    id: 'nutrition',
    label: 'Nutrition',
    icon: '🥗',
    color: '#4ADE80',
    gradientColors: ['#4ADE80', '#22D3EE'],
questions: [
  {
    field: 'nutrition_diet',
    label: 'Dietary Adherence: Do you follow any healthy dietary plan?',
    type: 'dropdown',
    options: ['Yes', 'No', 'Sometimes'],
  },
  {
    field: 'nutrition_junk',
    label: 'Intake Frequency: How many times per week do you eat junk/processed food?',
    type: 'number',
    min: 0,
    max: 21,
    unit: 'times',
    invertedScore: true,
  },
  {
    field: 'nutrition_water',
    label: 'Hydration: How many litres of water do you drink daily?',
    type: 'number',
    min: 0,
    max: 10,
    unit: 'litres',
  },
  {
    field: 'nutrition_digestion',
    label: 'Digestive Health: On a scale of 1–10 rate digestive comfort',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'Very Poor',
    highLabel: 'Excellent',
  },
],
  },

  // ── 3. MENTAL & EMOTIONAL WELLNESS (8 data points) ───────
  {
    id: 'mental',
    label: 'Mental',
    icon: '🧠',
    color: '#A78BFA',
    gradientColors: ['#A78BFA', '#EC4899'],
questions: [
  {
    field: 'mental_stress',
    label: 'Stress & Mood: On a scale of 1–10 rate your stress level',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'Very Low',
    highLabel: 'Extreme',
    invertedScore: true,
  },
  {
    field: 'mental_irritability',
    label: 'Behavioral Markers: How frequently do you experience irritability?',
    type: 'number',
    min: 0,
    max: 20,
    unit: 'times',
    invertedScore: true,
  },
  {
    field: 'mental_meditation',
    label: 'Resilience: How many times per week do you practice meditation or mindfulness?',
    type: 'number',
    min: 0,
    max: 7,
    unit: 'days',
  },
],
  },

  // ── 4. SLEEP & RECOVERY WELLNESS (7 data points) ─────────
  {
    id: 'sleep',
    label: 'Sleep',
    icon: '🌙',
    color: '#38BDF8',
    gradientColors: ['#1E3A5F', '#38BDF8'],
  questions: [
  {
    field: 'sleep_hours',
    label: 'Sleep Patterns: How many hours of sleep do you get per night?',
    type: 'number',
    min: 0,
    max: 12,
    unit: 'hrs',
  },
  {
    field: 'sleep_bedtime',
    label: 'Bedtime: Do you maintain a consistent bedtime?',
    type: 'yesno',
  },
  {
    field: 'sleep_quality',
    label: 'Sleep Quality: On a scale of 1–10 how would you rate your sleep quality?',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'Very Poor',
    highLabel: 'Excellent',
  },
],
  },

  // ── 5. SEXUAL & REPRODUCTIVE WELLNESS (7 data points) ────
  {
    id: 'reproductive',
    label: 'Reproductive',
    icon: '🌸',
    color: '#F472B6',
    gradientColors: ['#F472B6', '#FB7185'],
questions: [
  {
    field: 'repro_libido',
    label: 'Function & Drive: How would you rate your libido?',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'Very Low',
    highLabel: 'Normal',
  },
  {
    field: 'repro_hormonal',
    label: 'Symptom Tracking: Rate hormonal symptoms such as mood swings or fatigue',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'None',
    highLabel: 'Severe',
    invertedScore: true,
  },
  {
    field: 'repro_cycle',
    label: 'Cyclical Health: Is your menstrual cycle regular?',
    type: 'yesno',
    optional: true,
  },
],
  },

  // ── 6. FINANCIAL WELLNESS (7 data points) ────────────────
  {
    id: 'financial',
    label: 'Financial',
    icon: '💰',
    color: '#FBBF24',
    gradientColors: ['#FBBF24', '#F59E0B'],
 questions: [
  {
    field: 'finance_savings',
    label: 'Savings: What percentage of your income do you save?',
    type: 'number',
    min: 0,
    max: 100,
    unit: '%',
  },
  {
    field: 'finance_emergency',
    label: 'Security: How many months could your emergency savings support you?',
    type: 'number',
    min: 0,
    max: 60,
    unit: 'months',
  },
  {
    field: 'finance_stress',
    label: 'Financial Stress: Rate your financial stress level',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'None',
    highLabel: 'Extreme',
    invertedScore: true,
  },
],
  },

  // ── 7. TECH & DIGITAL WELLNESS (7 data points) ───────────
  {
    id: 'tech',
    label: 'Tech & Digital',
    icon: '📱',
    color: '#34D399',
    gradientColors: ['#34D399', '#059669'],
 questions: [
  {
    field: 'tech_screentime',
    label: 'Screen Time: What is your average daily screen time?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'hrs',
    invertedScore: true,
  },
  {
    field: 'tech_social',
    label: 'Social Media: How many hours do you spend on social media daily?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'hrs',
    invertedScore: true,
  },
],
  },

  // ── 8. SOCIAL & RELATIONSHIP WELLNESS (7 data points) ────
  {
    id: 'social',
    label: 'Social',
    icon: '🤝',
    color: '#60A5FA',
    gradientColors: ['#60A5FA', '#3B82F6'],
questions: [
  {
    field: 'social_interactions',
    label: 'Connection: How many meaningful social interactions did you have this week?',
    type: 'number',
    min: 0,
    max: 50,
    unit: 'times',
  },
  {
    field: 'social_conflict',
    label: 'Struggles: How frequently do you experience conflict in relationships?',
    type: 'scale',
    min: 1,
    max: 10,
    lowLabel: 'Never',
    highLabel: 'Very Often',
    invertedScore: true,
  },
],
  },

  // ── 9. OCCUPATIONAL & CORPORATE WELLNESS (8 data points) ─
  {
    id: 'occupational',
    label: 'Work',
    icon: '💼',
    color: '#FB923C',
    gradientColors: ['#FB923C', '#EF4444'],
 questions: [
  {
    field: 'work_hours',
    label: 'Workload: How many hours do you work daily?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'hrs',
  },
  {
    field: 'work_breaks',
    label: 'Breaktime: How frequently do you take breaks?',
    type: 'dropdown',
    options: [
      'Once every 20 minutes',
      'Once every hour',
      'Rarely',
      'Almost never',
    ],
  },
  {
    field: 'work_satisfaction',
    label: 'Satisfaction: Rate your job satisfaction and work-life balance',
    type: 'scale',
    min: 1,
    max: 10,
  },
  {
    field: 'work_stress',
    label: 'Strain: Rate work-related stress or physical strain',
    type: 'scale',
    min: 1,
    max: 10,
    invertedScore: true,
  },
],
  },
];

// ─── Flat map of all fields ───────────────────────────────────
export const ALL_FIELDS = CHECKIN_DOMAINS.flatMap((d) => d.questions.map((q) => q.field));

// ─── Required question count ──────────────────────────────────
export const REQUIRED_QUESTION_COUNT = CHECKIN_DOMAINS.flatMap((d) =>
  d.questions.filter((q) => !q.optional)
).length;