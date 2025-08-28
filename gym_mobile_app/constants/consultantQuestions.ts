import { Question } from './userQuestions';

export const consultantQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: "Which area do you specialize in?",
    options: [
      "Personal Training",
      "Nutrition",
      "Physical Therapy",
      "Yoga Instruction",
      "Medical Consultation",
      "Spa Therapy",
      "Mental Wellness",
      "Other"
    ]
  },
  {
    id: 2,
    type: 'text',
    question: "How many years of experience do you have?",
    placeholder: "Enter years of experience"
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: "What certifications do you hold?",
    options: [
      "ACE Certified",
      "NASM Certified",
      "ISSA Certified",
      "Registered Dietitian",
      "Licensed Therapist",
      "Medical Doctor",
      "Other certification"
    ]
  },
  {
    id: 4,
    type: 'text',
    question: "What is your educational background?",
    placeholder: "List your degrees and relevant education"
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: "What age groups do you typically work with?",
    options: [
      "Teens (13-19)",
      "Young adults (20-35)",
      "Adults (36-55)",
      "Seniors (55+)",
      "All age groups"
    ]
  },
  {
    id: 6,
    type: 'multiple-choice',
    question: "What is your preferred coaching style?",
    options: [
      "Strict and disciplined",
      "Supportive and encouraging",
      "Educational and informative",
      "Holistic and wellness-focused",
      "Results-driven"
    ]
  },
  {
    id: 7,
    type: 'text',
    question: "Describe your approach to client wellness",
    placeholder: "Explain your philosophy and methods"
  },
  {
    id: 8,
    type: 'multiple-choice',
    question: "What availability do you have for new clients?",
    options: [
      "Full-time availability",
      "Part-time availability",
      "Limited spots available",
      "Currently not accepting new clients"
    ]
  },
  {
    id: 9,
    type: 'text',
    question: "What are your hourly rates?",
    placeholder: "Enter your consultation fees"
  },
  {
    id: 10,
    type: 'text',
    question: "Do you have any specializations or niches?",
    placeholder: "List any special areas of expertise"
  }
];