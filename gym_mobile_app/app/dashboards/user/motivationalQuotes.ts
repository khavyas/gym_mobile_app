// motivationalQuotes.ts

export interface Quote {
  text: string;
  author: string;
}

export const motivationalQuotes: Quote[] = [
  {
    text: "Small, consistent actions create extraordinary health outcomes. Every healthy choice you make today is an investment in your future self.",
    author: "Dr. James Clear, Behavioral Scientist"
  },
  {
    text: "The only bad workout is the one that didn't happen. Your body keeps an accurate journal regardless of what you write down.",
    author: "Maya Thompson, Fitness Coach"
  },
  {
    text: "Health is not just about what you're eating. It's also about what you're thinking and saying.",
    author: "Dr. Susan Reed, Wellness Expert"
  },
  {
    text: "Take care of your body. It's the only place you have to live. Every small step towards health is a victory worth celebrating.",
    author: "Jim Rohn, Motivational Speaker"
  },
  {
    text: "Your health is an investment, not an expense. The time you spend taking care of yourself today will pay dividends for years to come.",
    author: "Dr. Michael Chen, Healthcare Advocate"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Sarah Martinez, Personal Trainer"
  },
  {
    text: "The greatest wealth is health. When you have your health, you have everything. Never take it for granted.",
    author: "Ancient Proverb, Adapted"
  },
  {
    text: "You don't have to be extreme, just consistent. Small daily improvements lead to stunning long-term results.",
    author: "David Williams, Wellness Coach"
  },
  {
    text: "Your body hears everything your mind says. Stay positive, work hard, and make it happen.",
    author: "Dr. Lisa Anderson, Sports Psychologist"
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow. Every challenge is an opportunity to grow stronger.",
    author: "Robert Chen, Fitness Mentor"
  }
];

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};