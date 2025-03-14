
export interface User {
  id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  isAdmin?: boolean;
  balance?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  entryFee: number;
  minPlayers: number;
}

export interface Game {
  id: string;
  categoryId: string;
  status: 'waiting' | 'inProgress' | 'completed';
  players: User[];
  timeToStart?: number;
  questions?: Question[];
  startTime?: Date;
  endTime?: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  categoryId: string;
  difficulty: string;
}

export interface Answer {
  questionId: string;
  answer: number;
  timeToAnswer: number;
  isCorrect: boolean;
  points: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'deposit' | 'withdrawal' | 'game_entry' | 'winnings';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  referenceId?: string;
  createdAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  bonusAmount: number;
  createdAt: Date;
}
