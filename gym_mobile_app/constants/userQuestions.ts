export interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  placeholder?: string;
}

export const userQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: "What's your primary wellness goal?",
    options: [
      "Weight loss",
      "Muscle building",
      "General fitness",
      "Stress reduction",
      "Improve flexibility"
    ]
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: "How often do you plan to exercise?",
    options: [
      "1-2 times per week",
      "3-4 times per week",
      "5+ times per week",
      "Not sure yet"
    ]
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: "What's your current fitness level?",
    options: [
      "Beginner",
      "Intermediate",
      "Advanced",
      "Not active currently"
    ]
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: "Do you have any health concerns we should know about?",
    options: [
      "None",
      "Joint issues",
      "Heart conditions",
      "High blood pressure",
      "Other"
    ]
  },
  {
    id: 5,
    type: 'text',
    question: "What specific results are you hoping to achieve?",
    placeholder: "Describe your wellness goals"
  }
];