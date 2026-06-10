/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetLineItem {
  id: string;
  category: 'needs' | 'wants' | 'savings';
  name: string;
  amount: number;
}

export interface UserProgress {
  completedModules: string[]; // e.g. ['presupuesto', 'ahorro', 'deuda_credito', 'fondo_emergencia']
  points: number;
  quizHighScore: number;
  completedQuiz: boolean;
  budgetIncome: number;
  budgetExpenses: BudgetLineItem[];
}

export interface User {
  username: string;
  email: string;
  password?: string;
  progress: UserProgress;
}

export type TabType = 'inicio' | 'teoria' | 'practica' | 'quiz' | 'configuracion';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
