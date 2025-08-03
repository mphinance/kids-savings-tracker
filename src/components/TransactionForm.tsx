import React, { useState } from 'react';
import { Plus, Calculator, Zap } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'runningBalance'>) => void;
  onCalculateInterest: () => void;
  onAutoInterest: () => void;
  currentBalance: number;
  savingsRate: number;
  compoundingPeriod: 'weekly' | 'monthly' | 'annually';
}

export default function TransactionForm({ onAddTransaction, onCalculateInterest, onAutoInterest, currentBalance, savingsRate, compoundingPeriod }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    memo: '',
    type: 'deposit' as const,
    amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    onAddTransaction({
      date: formData.date,
      description: formData.description,
      memo: formData.memo,
      type: formData.type,
      amount: parseFloat(formData.amount)
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      memo: '',
      type: 'deposit',
      amount: ''
    });
  };

  const periodInterest = (() => {
    const weeklyInterest = (currentBalance * (savingsRate / 100));
    switch (compoundingPeriod) {
      case 'weekly':
        return weeklyInterest;
      case 'monthly':
        return weeklyInterest * 4;
      case 'annually':
        return weeklyInterest * 52;
      default:
        return weeklyInterest;
    }
  })();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Add Transaction</h3>
        <div className="flex gap-2">
          <button
            onClick={onAutoInterest}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            title="Automatically add all missing interest payments"
          >
            <Zap size={16} />
            Auto Interest
          </button>
          <button
            onClick={onCalculateInterest}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            title={`Add ${compoundingPeriod} interest: $${periodInterest.toFixed(2)}`}
          >
            <Calculator size={16} />
            Add Interest
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="interest">Interest</option>
              <option value="goal_reward">Goal Reward</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Weekly allowance, Chores completed, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Memo</label>
          <input
            type="text"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </form>
    </div>
  );
}