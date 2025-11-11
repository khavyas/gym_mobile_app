export interface WellnessQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'text' | 'scale';
  options?: string[];
  placeholder?: string;
  dataTag: string;
  scaleMin?: number;
  scaleMax?: number;
}

export const wellnessQuestions: WellnessQuestion[] = [
    {
    id: 1,
    question: "How would you describe your energy levels throughout the day?",
    type: 'multiple-choice',
    dataTag: 'daily_energy_level',
    options: ['Very low', 'Below average', 'Moderate', 'Good', 'Excellent']
  },
  {
    id: 2,
    question: "How often do you feel low on energy or fatigued during the day?",
    type: 'multiple-choice',
    dataTag: 'energy_level',
    options: ['Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 3,
    question: "How would you describe your current stress level?",
    type: 'multiple-choice',
    dataTag: 'stress_level',
    options: ['Low', 'Moderate', 'High']
  },
  {
    id: 4,
    question: "How often do you engage in physical activity (e.g., walking, gym, yoga)?",
    type: 'multiple-choice',
    dataTag: 'activity_frequency',
    options: ['Daily', 'Few times a week', 'Occasionally', 'Rarely']
  },
  {
    id: 5,
    question: "How many hours of sleep do you usually get per night?",
    type: 'multiple-choice',
    dataTag: 'sleep_duration',
    options: ['Less than 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', 'More than 8 hours']
  },
  {
    id: 6,
    question: "How would you describe your eating habits?",
    type: 'multiple-choice',
    dataTag: 'nutrition_pattern',
    options: ['Regular meals', 'Irregular', 'Skipped meals', 'Emotional eating']
  },
  {
    id: 7,
    question: "How often do you feel anxious, irritable, or overwhelmed?",
    type: 'multiple-choice',
    dataTag: 'anxiety_frequency',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  {
    id: 8,
    question: "What usually influences your mood the most? (Select all that apply)",
    type: 'multiple-choice',
    dataTag: 'mood_influencers',
    options: ['Work stress', 'Relationships', 'Sleep', 'Health', 'Social connection', 'Other']
  },
  {
    id: 9,
    question: "Do you have any existing medical conditions or medications?",
    type: 'text',
    dataTag: 'health_condition',
    placeholder: 'Enter conditions or medications (optional)'
  },
  {
    id: 10,
    question: "What are your top 1-2 health goals right now?",
    type: 'multiple-choice',
    dataTag: 'health_goal',
    options: [
      'Weight management',
      'Better sleep',
      'Stress reduction',
      'Improve energy',
      'Pain relief',
      'Fitness'
    ]
  },
  {
    id: 11,
    question: "How ready are you to make small lifestyle changes in the next month?",
    type: 'scale',
    dataTag: 'readiness_score',
    scaleMin: 1,
    scaleMax: 5,
    options: ['1 - Not ready', '2', '3', '4', '5 - Fully ready']
  },
  {
    id: 12,
    question: "What kind of support would help you most?",
    type: 'multiple-choice',
    dataTag: 'support_preference',
    options: [
      'Personal coaching',
      'Daily tips',
      'Group challenges',
      'App reminders',
      'Progress tracking'
    ]
  }
];