// Messages.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ContactsList from './ContactsList';
import ChatScreen from './ChatScreen';

export type Contact = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  isUser: boolean;
};

// Mock data for contacts
export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    role: 'Fitness Coach',
    avatar: 'https://i.pravatar.cc/150?img=47',
    lastMessage: 'A bit sore in my legs, but nothing too intense.',
    timestamp: '10:40 AM',
    unreadCount: 0,
    online: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Nutritionist',
    avatar: 'https://i.pravatar.cc/150?img=33',
    lastMessage: "Don't forget to drink plenty of water!",
    timestamp: 'Yesterday',
    unreadCount: 2,
    online: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    role: 'Physical Therapist',
    avatar: 'https://i.pravatar.cc/150?img=45',
    lastMessage: 'Your recovery is looking great!',
    timestamp: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
  {
    id: '4',
    name: 'Dr. James Anderson',
    role: 'Sports Medicine',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'See you next week for follow-up',
    timestamp: '2 days ago',
    unreadCount: 1,
    online: false,
  },
  {
    id: '5',
    name: 'Dr. Lisa Martinez',
    role: 'Yoga Instructor',
    avatar: 'https://i.pravatar.cc/150?img=29',
    lastMessage: 'Great job on the flexibility exercises!',
    timestamp: '3 days ago',
    unreadCount: 0,
    online: true,
  },
  {
    id: '6',
    name: 'Dr. David Thompson',
    role: 'Cardiologist',
    avatar: 'https://i.pravatar.cc/150?img=52',
    lastMessage: 'Your heart rate looks perfect',
    timestamp: '4 days ago',
    unreadCount: 0,
    online: false,
  },
  {
    id: '7',
    name: 'Dr. Jennifer Lee',
    role: 'Mental Health Coach',
    avatar: 'https://i.pravatar.cc/150?img=38',
    lastMessage: 'How are you feeling today?',
    timestamp: '5 days ago',
    unreadCount: 3,
    online: true,
  },
  {
    id: '8',
    name: 'Dr. Robert Brown',
    role: 'Strength Trainer',
    avatar: 'https://i.pravatar.cc/150?img=60',
    lastMessage: "Let's increase the weight next session",
    timestamp: '1 week ago',
    unreadCount: 0,
    online: false,
  },
  {
    id: '9',
    name: 'Dr. Amanda White',
    role: 'Dietitian',
    avatar: 'https://i.pravatar.cc/150?img=44',
    lastMessage: 'Here are your meal plans for next week',
    timestamp: '1 week ago',
    unreadCount: 0,
    online: true,
  },
  {
    id: '10',
    name: 'Dr. Kevin Harris',
    role: 'Rehabilitation Specialist',
    avatar: 'https://i.pravatar.cc/150?img=14',
    lastMessage: 'Keep up with the exercises!',
    timestamp: '2 weeks ago',
    unreadCount: 0,
    online: false,
  },
];

// Mock chat history for each contact
export const chatHistory: { [key: string]: Message[] } = {
  '1': [
    {
      id: '1',
      text: 'Hi! How did your workout go today?',
      timestamp: '10:30 AM',
      isUser: false,
    },
    {
      id: '2',
      text: 'It went really well! I managed to complete all the sets you recommended.',
      timestamp: '10:35 AM',
      isUser: true,
    },
    {
      id: '3',
      text: "That's fantastic! How are you feeling? Any soreness?",
      timestamp: '10:36 AM',
      isUser: false,
    },
    {
      id: '4',
      text: 'A bit sore in my legs, but nothing too intense. The protein shake helped with recovery.',
      timestamp: '10:40 AM',
      isUser: true,
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Good morning! Have you been following the meal plan?',
      timestamp: 'Yesterday, 9:00 AM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Yes! I feel much more energized.',
      timestamp: 'Yesterday, 9:15 AM',
      isUser: true,
    },
    {
      id: '3',
      text: "That's wonderful! Remember to stay hydrated.",
      timestamp: 'Yesterday, 9:20 AM',
      isUser: false,
    },
    {
      id: '4',
      text: "Don't forget to drink plenty of water!",
      timestamp: 'Yesterday, 9:21 AM',
      isUser: false,
    },
  ],
  '3': [
    {
      id: '1',
      text: 'How is your knee feeling after the therapy?',
      timestamp: 'Yesterday, 2:00 PM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Much better! The pain has reduced significantly.',
      timestamp: 'Yesterday, 2:30 PM',
      isUser: true,
    },
    {
      id: '3',
      text: 'Your recovery is looking great!',
      timestamp: 'Yesterday, 2:35 PM',
      isUser: false,
    },
  ],
  '4': [
    {
      id: '1',
      text: 'Your injury is healing well. Keep up with the rest.',
      timestamp: '2 days ago, 11:00 AM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Thank you, doctor! When should I come for the next checkup?',
      timestamp: '2 days ago, 11:15 AM',
      isUser: true,
    },
    {
      id: '3',
      text: 'See you next week for follow-up',
      timestamp: '2 days ago, 11:20 AM',
      isUser: false,
    },
  ],
  '5': [
    {
      id: '1',
      text: 'Namaste! Ready for today\'s yoga session?',
      timestamp: '3 days ago, 6:00 AM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Yes! I practiced the poses you showed me.',
      timestamp: '3 days ago, 6:05 AM',
      isUser: true,
    },
    {
      id: '3',
      text: 'Great job on the flexibility exercises!',
      timestamp: '3 days ago, 7:00 AM',
      isUser: false,
    },
  ],
  '6': [
    {
      id: '1',
      text: 'I reviewed your latest ECG results.',
      timestamp: '4 days ago, 3:00 PM',
      isUser: false,
    },
    {
      id: '2',
      text: 'How does it look?',
      timestamp: '4 days ago, 3:10 PM',
      isUser: true,
    },
    {
      id: '3',
      text: 'Your heart rate looks perfect',
      timestamp: '4 days ago, 3:15 PM',
      isUser: false,
    },
  ],
  '7': [
    {
      id: '1',
      text: 'How are you feeling today?',
      timestamp: '5 days ago, 10:00 AM',
      isUser: false,
    },
    {
      id: '2',
      text: 'A bit stressed with work, but managing.',
      timestamp: '5 days ago, 10:30 AM',
      isUser: true,
    },
    {
      id: '3',
      text: 'Remember to practice the breathing exercises we discussed.',
      timestamp: '5 days ago, 10:35 AM',
      isUser: false,
    },
  ],
  '8': [
    {
      id: '1',
      text: 'Great session today! You lifted 10kg more.',
      timestamp: '1 week ago, 5:00 PM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Thank you! I felt strong today.',
      timestamp: '1 week ago, 5:15 PM',
      isUser: true,
    },
    {
      id: '3',
      text: "Let's increase the weight next session",
      timestamp: '1 week ago, 5:20 PM',
      isUser: false,
    },
  ],
  '9': [
    {
      id: '1',
      text: 'Here are your meal plans for next week',
      timestamp: '1 week ago, 8:00 AM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Looks delicious and healthy!',
      timestamp: '1 week ago, 8:30 AM',
      isUser: true,
    },
  ],
  '10': [
    {
      id: '1',
      text: 'Your mobility has improved significantly!',
      timestamp: '2 weeks ago, 1:00 PM',
      isUser: false,
    },
    {
      id: '2',
      text: 'Thank you! The exercises really help.',
      timestamp: '2 weeks ago, 1:15 PM',
      isUser: true,
    },
    {
      id: '3',
      text: 'Keep up with the exercises!',
      timestamp: '2 weeks ago, 1:20 PM',
      isUser: false,
    },
  ],
};

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  return (
    <View style={styles.container}>
      {selectedContact ? (
        <ChatScreen 
          contact={selectedContact} 
          onBack={handleBack}
          initialMessages={chatHistory[selectedContact.id] || []}
        />
      ) : (
        <ContactsList 
          contacts={contacts} 
          onContactSelect={handleContactSelect} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});