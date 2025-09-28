export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender?: 'male' | 'female';
  height?: number;
  dietPreference?: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'other';
  healthIssues: string;
  dietStartDate: string;
  dietEndDate: string;
  targetWeight: number;
  startWeight: number;
  currentWeight: number;
  primaryCoach?: string;
  status?: 'active' | 'paused' | 'not-responding' | 'completed';
  createdAt: string;
}

export interface MealEntry {
  id: string;
  clientId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  photoUrl?: string;
  calories?: number;
  notes?: string;
  createdAt: string;
}

export interface DailyProgress {
  id: string;
  clientId: string;
  date: string;
  morningDrink: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  nightDrink: boolean;
  workout: boolean;
  weight?: number;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  clientId: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'dietician';
  message: string;
  messageType: 'text' | 'image' | 'meal';
  attachmentUrl?: string;
  mealEntryId?: string;
  createdAt: string;
  readAt?: string;
}

export interface WeightRecord {
  id: string;
  clientId: string;
  date: string;
  weight: number;
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  clientId: string;
  title: string;
  message: string;
  type: 'reminder' | 'message' | 'achievement' | 'alert';
  read: boolean;
  createdAt: string;
}