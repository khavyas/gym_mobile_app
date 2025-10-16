// blogPosts.ts - Place this file in the same directory as HomeSummary

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  credentials: string;
  category: string;
  readTime: string;
  imageUrl: string;
  content: string;
  publishedDate: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Nutrition Myths Debunked',
    description: 'Separating fact from fiction in modern nutrition science.',
    author: 'Dr. Michael Chen',
    credentials: 'RD',
    category: 'Nutrition',
    readTime: '12:15',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    publishedDate: '2025-10-10',
    content: `
# Nutrition Myths Debunked

## Introduction
In the world of nutrition, misinformation spreads faster than facts. Let's separate truth from fiction.

## Myth 1: Carbs Are the Enemy
Carbohydrates are not inherently bad. Complex carbs from whole grains, fruits, and vegetables provide essential nutrients and energy. The key is choosing the right types and portions.

## Myth 2: Fat Makes You Fat
Healthy fats from sources like avocados, nuts, and olive oil are essential for hormone production, brain health, and nutrient absorption. It's excess calories, not fat itself, that leads to weight gain.

## Myth 3: You Need to Detox
Your liver and kidneys are natural detoxification systems. Expensive detox teas and cleanses are unnecessary and can sometimes be harmful.

## The Truth About Supplements
While supplements can help fill nutritional gaps, they shouldn't replace a balanced diet. Whole foods provide a complex mix of nutrients that work synergistically.

## Conclusion
Focus on whole, minimally processed foods, stay hydrated, and maintain a balanced approach to eating. Your body is smarter than you think.
    `
  },
  {
    id: '2',
    title: 'Mental Health & Physical Wellness',
    description: 'The crucial connection between mind and body health.',
    author: 'Dr. Emily Rodriguez',
    credentials: 'PhD',
    category: 'Mental Health',
    readTime: '15:30',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    publishedDate: '2025-10-12',
    content: `
# Mental Health & Physical Wellness

## The Mind-Body Connection
Your mental and physical health are intrinsically linked. Understanding this connection is key to holistic wellness.

## How Exercise Affects Mental Health
Physical activity releases endorphins, reduces stress hormones, and improves sleep quality. Even 20 minutes of daily movement can significantly impact your mood.

### Benefits of Regular Exercise:
- Reduced anxiety and depression symptoms
- Improved self-esteem
- Better stress management
- Enhanced cognitive function

## The Role of Sleep
Quality sleep is essential for both mental and physical recovery. Aim for 7-9 hours per night and maintain a consistent sleep schedule.

## Stress Management Techniques
- **Mindfulness meditation**: 10 minutes daily can reduce stress
- **Deep breathing exercises**: Activate your parasympathetic nervous system
- **Progressive muscle relaxation**: Release physical tension
- **Social connections**: Maintain meaningful relationships

## Nutrition for Mental Health
Omega-3 fatty acids, B vitamins, and antioxidants support brain health. A Mediterranean-style diet has been linked to lower rates of depression.

## When to Seek Help
Don't hesitate to reach out to mental health professionals. Therapy and counseling are signs of strength, not weakness.

## Conclusion
Taking care of your mental health is just as important as physical fitness. They work together to create overall wellness.
    `
  },
  {
    id: '3',
    title: 'Building Sustainable Fitness Habits',
    description: 'Long-term strategies for maintaining an active lifestyle.',
    author: 'Sarah Thompson',
    credentials: 'CPT, CSCS',
    category: 'Fitness',
    readTime: '10:45',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    publishedDate: '2025-10-14',
    content: `
# Building Sustainable Fitness Habits

## Start Small, Think Big
The key to long-term fitness success is building habits that stick, not pursuing quick fixes.

## The 2-Minute Rule
If a workout seems too daunting, commit to just 2 minutes. Often, starting is the hardest part, and you'll naturally want to continue.

## Consistency Over Intensity
Three moderate workouts per week are better than one intense session followed by burnout. Build a routine you can maintain.

## Find Activities You Enjoy
Exercise shouldn't feel like punishment. Try different activities until you find what makes you excited to move.

## Track Progress Beyond the Scale
- Increased energy levels
- Better sleep quality
- Improved mood
- Strength gains
- Flexibility improvements

## Build Your Support System
Share your goals with friends, join fitness communities, or work with a trainer. Accountability increases success rates.

## Conclusion
Sustainable fitness is about creating a lifestyle, not following a temporary program. Be patient with yourself and celebrate small wins.
    `
  },
  {
    id: '4',
    title: 'Hydration: The Overlooked Health Essential',
    description: 'Understanding the critical role of proper hydration.',
    author: 'Dr. James Peterson',
    credentials: 'MD, Sports Medicine',
    category: 'Wellness',
    readTime: '8:20',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
    publishedDate: '2025-10-15',
    content: `
# Hydration: The Overlooked Health Essential

## Why Water Matters
Water makes up about 60% of your body weight and is involved in nearly every bodily function.

## Signs of Dehydration
- Dark yellow urine
- Persistent fatigue
- Headaches
- Dry skin
- Dizziness
- Reduced cognitive function

## How Much Water Do You Need?
While the "8 glasses a day" rule is a good starting point, individual needs vary based on:
- Activity level
- Climate
- Body size
- Overall health

## Hydration Tips
1. Drink water first thing in the morning
2. Carry a reusable water bottle
3. Set reminders on your phone
4. Eat water-rich foods (cucumbers, watermelon, oranges)
5. Drink before, during, and after exercise

## Beyond Water
Herbal teas, coconut water, and fruits contribute to hydration. Limit sugary drinks and excessive caffeine.

## Conclusion
Proper hydration is one of the simplest yet most impactful health habits you can develop. Make it a priority.
    `
  }
];

export const getRandomBlogPosts = (count: number = 2): BlogPost[] => {
  const shuffled = [...blogPosts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};