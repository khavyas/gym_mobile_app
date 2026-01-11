export interface Consultant {
  _id: string;
  user: string;
  gym: string;
  name: string;
  specialty: string;
  description?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  yearsOfExperience?: number;
  certifications?: string[];
  badges?: string[];
  qualification?: Array<{
    degree: string;
    board: string;
    year: number;
    field: string;
  }>;
  modeOfTraining?: 'online' | 'offline' | 'hybrid';
  pricing?: {
    perSession?: number;
    perMonth?: number;
    perWeek?: number;
    perDay?: number;
    currency?: string;
    packages?: Package[];
  };
  availability?: {
    status?: 'Available Now' | 'Available Tomorrow' | 'Busy';
    nextSlot?: string;
    workingDays?: string[];
    workingHours?: {
      start: string;
      end: string;
    };
  };
  contact?: {
    phone: string;
    email: string;
    website?: string;
    location?: string;
  };
  consent: boolean;
  privacyNoticeAccepted: boolean;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Package {
  title: string;
  duration: string;
  price: number;
}