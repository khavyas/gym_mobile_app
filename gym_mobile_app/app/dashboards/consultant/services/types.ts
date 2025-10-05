export interface Consultant {
  _id: string;
  user: string;
  gym: string;
  name: string;
  specialty: string;
  description?: string;
  yearsOfExperience: number;
  certifications: string[];
  badges: string[];
  modeOfTraining: 'online' | 'offline' | 'hybrid';
  pricing: {
    perSession?: number;
    perMonth?: number;
    perWeek?: number;
    perDay?: number;
    packages: Package[];
  };
  availability: {
    status: 'Available Now' | 'Available Tomorrow' | 'Busy';
    nextSlot?: string;
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
  };
  rating: number;
  reviewsCount: number;
  image?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  title: string;
  duration: string;
  price: number;
}

export interface Appointment {
  id: string;
  client: string;
  date: string;
  time: string;
  type: string;
  avatar: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export interface DashboardStats {
  totalClients: number;
  monthlyRevenue: number;
  completedSessions: number;
  averageRating: number;
}