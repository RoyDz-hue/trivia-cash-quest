
export interface User {
  id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  isAdmin?: boolean;
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
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface Answer {
  questionId: string;
  answer: number;
  timeToAnswer: number;
}
