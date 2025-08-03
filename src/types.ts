export interface Transaction {
  id: string;
  date: string;
  description: string;
  memo: string;
  type: 'deposit' | 'withdrawal' | 'interest' | 'goal_reward';
  amount: number;
  runningBalance: number;
}

export interface AccountSettings {
  childName: string;
  accountName: string;
  savingsRate: number; // Weekly percentage rate
  compoundingPeriod: 'weekly' | 'monthly' | 'annually';
  goal: number;
}