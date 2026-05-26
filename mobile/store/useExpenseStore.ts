import { create } from 'zustand';
import { Expense } from '../types';
import { SAMPLE_EXPENSES } from '../constants/mockData';

interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  getTotalExpenses: () => number;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: SAMPLE_EXPENSES,
  addExpense: (data) => set((state) => ({
    expenses: [{ ...data, id: `E${String(state.expenses.length + 1).padStart(3, '0')}`, createdAt: new Date().toISOString() }, ...state.expenses],
  })),
  deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
  getTotalExpenses: () => get().expenses.reduce((sum, e) => sum + e.amount, 0),
}));
