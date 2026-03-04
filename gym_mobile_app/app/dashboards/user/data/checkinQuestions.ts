// ─────────────────────────────────────────────────────────────
//  HiWox Weekly Check-In — Question Config
//  All 9 domains · 35 questions · matches DB field names exactly
// ─────────────────────────────────────────────────────────────

export type FieldType = 'scale' | 'number' | 'yesno' | 'dropdown';

export interface CheckInQuestion {
  field: string;           // matches DB column name exactly
  label: string;           // shown to user
  type: FieldType;
  min?: number;            // for scale / number
  max?: number;
  unit?: string;           // e.g. 'kg', 'hrs', 'bpm'
  lowLabel?: string;       // left label for scale (e.g. "Very Low")
  highLabel?: string;      // right label for scale (e.g. "Excellent")
  options?: string[];      // for dropdown type
  optional?: boolean;
  invertedScore?: boolean; // true = higher raw value is WORSE (negative metric)
}

export interface CheckInDomain {
  id: string;
  label: string;
  icon: string;
  color: string;           // accent color for this domain
  gradientColors: [string, string];
  questions: CheckInQuestion[];
}

export const CHECKIN_DOMAINS: CheckInDomain[] = [
  {
    id: 'physical',
    label: 'Physical',
    icon: '🏃',
    color: '#FF6B6B',
    gradientColors: ['#FF6B6B', '#FF8E53'],
    questions: [
      {
        field: 'physical_weight',
        label: 'Current weight',
        type: 'number',
        min: 30,
        max: 300,
        unit: 'kg',
      },
      {
        field: 'physical_steps',
        label: 'Average daily steps this week',
        type: 'number',
        min: 0,
        max: 50000,
        unit: 'steps',
      },
      {
        field: 'physical_workouts',
        label: 'Workout sessions completed',
        type: 'number',
        min: 0,
        max: 7,
        unit: 'sessions',
      },
      {
        field: 'physical_energy',
        label: 'Energy level this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Low',
        highLabel: 'Excellent',
      },
      {
        field: 'physical_rhr',
        label: 'Resting heart rate this morning',
        type: 'number',
        min: 30,
        max: 200,
        unit: 'bpm',
        optional: true,
        invertedScore: true,
      },
    ],
  },

  {
    id: 'nutrition',
    label: 'Nutrition',
    icon: '🥗',
    color: '#4ADE80',
    gradientColors: ['#4ADE80', '#22D3EE'],
    questions: [
      {
        field: 'nutrition_adherence',
        label: 'How well did you follow your meal plan?',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Not at all',
        highLabel: 'Perfectly',
      },
      {
        field: 'nutrition_sugar',
        label: 'Times you consumed sugary food/drinks',
        type: 'number',
        min: 0,
        max: 21,
        unit: 'times',
        invertedScore: true,
      },
      {
        field: 'nutrition_processed',
        label: 'Times you ate processed/junk food',
        type: 'number',
        min: 0,
        max: 21,
        unit: 'times',
        invertedScore: true,
      },
      {
        field: 'nutrition_water',
        label: 'Average daily water intake',
        type: 'number',
        min: 0,
        max: 10,
        unit: 'litres',
      },
      {
        field: 'nutrition_digestion',
        label: 'Digestion / gut comfort this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Poor',
        highLabel: 'Excellent',
      },
    ],
  },

  {
    id: 'mental',
    label: 'Mental',
    icon: '🧠',
    color: '#A78BFA',
    gradientColors: ['#A78BFA', '#EC4899'],
    questions: [
      {
        field: 'mental_stress',
        label: 'Overall stress level this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Low',
        highLabel: 'Extreme',
        invertedScore: true,
      },
      {
        field: 'mental_mood',
        label: 'Overall mood this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Low',
        highLabel: 'Excellent',
      },
      {
        field: 'mental_anxiety',
        label: 'Anxiety level this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'Severe',
        invertedScore: true,
      },
      {
        field: 'mental_motivation',
        label: 'How motivated did you feel?',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'High',
      },
      {
        field: 'mental_meditation',
        label: 'Days you meditated / practiced mindfulness',
        type: 'number',
        min: 0,
        max: 7,
        unit: 'days',
      },
      {
        field: 'mental_burnout',
        label: 'Burnout score',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'Severe',
        invertedScore: true,
      },
    ],
  },

  {
    id: 'sleep',
    label: 'Sleep',
    icon: '🌙',
    color: '#38BDF8',
    gradientColors: ['#1E3A5F', '#38BDF8'],
    questions: [
      {
        field: 'sleep_hours',
        label: 'Average sleep duration this week',
        type: 'number',
        min: 0,
        max: 12,
        unit: 'hrs',
      },
      {
        field: 'sleep_quality',
        label: 'Sleep quality rating',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Poor',
        highLabel: 'Excellent',
      },
      {
        field: 'sleep_consistency',
        label: 'How consistent was your bedtime?',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Inconsistent',
        highLabel: 'Very Consistent',
      },
      {
        field: 'sleep_fatigue',
        label: 'Morning fatigue level',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Tired',
        highLabel: 'Fully Rested',
      },
      {
        field: 'sleep_screens',
        label: 'Did you use screens within 1 hr of bedtime?',
        type: 'yesno',
        invertedScore: true,
      },
      {
        field: 'sleep_caffeine',
        label: 'Did you consume caffeine after 6pm?',
        type: 'yesno',
        invertedScore: true,
      },
    ],
  },

  {
    id: 'reproductive',
    label: 'Reproductive',
    icon: '🌸',
    color: '#F472B6',
    gradientColors: ['#F472B6', '#FB7185'],
    questions: [
      {
        field: 'repro_libido',
        label: 'Libido score this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Low',
        highLabel: 'Normal',
      },
      {
        field: 'repro_hormonal',
        label: 'Hormonal symptom intensity',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'Severe',
        invertedScore: true,
      },
      {
        field: 'repro_pain',
        label: 'Physical pain/discomfort in reproductive area',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'Severe',
        invertedScore: true,
      },
      {
        field: 'repro_cycle',
        label: 'Was your menstrual cycle regular this month?',
        type: 'dropdown',
        options: ['Regular', 'Irregular', 'N/A'],
        optional: true,
      },
    ],
  },

  {
    id: 'financial',
    label: 'Financial',
    icon: '💰',
    color: '#FBBF24',
    gradientColors: ['#FBBF24', '#F59E0B'],
    questions: [
      {
        field: 'finance_budget',
        label: 'Did you stick to your budget this week?',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Not at all',
        highLabel: 'Fully',
      },
      {
        field: 'finance_stress',
        label: 'Financial stress level this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'Extreme',
        invertedScore: true,
      },
      {
        field: 'finance_saved',
        label: 'Did you save any money this week?',
        type: 'yesno',
      },
    ],
  },

  {
    id: 'tech',
    label: 'Tech & Digital',
    icon: '📱',
    color: '#34D399',
    gradientColors: ['#34D399', '#059669'],
    questions: [
      {
        field: 'tech_screentime',
        label: 'Average daily screen time',
        type: 'number',
        min: 0,
        max: 24,
        unit: 'hrs',
        invertedScore: true,
      },
      {
        field: 'tech_socialmedia',
        label: 'Average daily social media time',
        type: 'number',
        min: 0,
        max: 24,
        unit: 'hrs',
        invertedScore: true,
      },
      {
        field: 'tech_latenight',
        label: 'Days you used devices after 11pm',
        type: 'number',
        min: 0,
        max: 7,
        unit: 'days',
        invertedScore: true,
      },
      {
        field: 'tech_detox',
        label: 'Did you take any digital detox time?',
        type: 'yesno',
      },
    ],
  },

  {
    id: 'social',
    label: 'Social',
    icon: '🤝',
    color: '#60A5FA',
    gradientColors: ['#60A5FA', '#3B82F6'],
    questions: [
      {
        field: 'social_interactions',
        label: 'Meaningful conversations / interactions this week',
        type: 'number',
        min: 0,
        max: 50,
        unit: 'times',
      },
      {
        field: 'social_lonely',
        label: 'Loneliness score',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Not Lonely',
        highLabel: 'Very Lonely',
        invertedScore: true,
      },
      {
        field: 'social_quality',
        label: 'Quality of your close relationships this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Poor',
        highLabel: 'Excellent',
      },
      {
        field: 'social_events',
        label: 'Did you attend any social events or group activities?',
        type: 'yesno',
      },
    ],
  },

  {
    id: 'occupational',
    label: 'Work',
    icon: '💼',
    color: '#FB923C',
    gradientColors: ['#FB923C', '#EF4444'],
    questions: [
      {
        field: 'work_hours',
        label: 'Average work hours per day',
        type: 'number',
        min: 0,
        max: 24,
        unit: 'hrs',
        invertedScore: true,
      },
      {
        field: 'work_satisfaction',
        label: 'Job satisfaction this week',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Low',
        highLabel: 'Excellent',
      },
      {
        field: 'work_stress',
        label: 'Work stress level',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'None',
        highLabel: 'Extreme',
        invertedScore: true,
      },
      {
        field: 'work_balance',
        label: 'Work-life balance rating',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Very Poor',
        highLabel: 'Excellent',
      },
      {
        field: 'work_breaks',
        label: 'How often did you take proper breaks?',
        type: 'scale',
        min: 1,
        max: 10,
        lowLabel: 'Never',
        highLabel: 'Always',
      },
      {
        field: 'work_discomfort',
        label: 'Physical discomfort from work (posture, eye strain, etc.)?',
        type: 'yesno',
        invertedScore: true,
      },
    ],
  },
];

// ─── Flat map of all fields → useful for form state initialisation ───
export const ALL_FIELDS = CHECKIN_DOMAINS.flatMap((d) => d.questions.map((q) => q.field));

// ─── Total question count (excludes optional) ───
export const REQUIRED_QUESTION_COUNT = CHECKIN_DOMAINS.flatMap((d) =>
  d.questions.filter((q) => !q.optional)
).length;