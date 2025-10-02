export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Shopping",
  "Other"
] as const;

export type Category = typeof CATEGORIES[number];