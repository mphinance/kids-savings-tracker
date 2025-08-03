import React, { useState } from 'react';
import { Transaction } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Target, Edit3, Save, X, Trash2 } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id' | 'runningBalance'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionHistory({ transactions, onUpdateTransaction, onDeleteTransaction }: TransactionHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    date: '',
    description: '',
    memo: '',
    type: 'deposit' as const,
    amount: ''
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'withdrawal':
        return <TrendingDown className="text-red-500" size={16} />;
      case 'interest':
        return <DollarSign className="text-blue-500" size={16} />;
      case 'goal_reward':
        return <Target className="text-purple-500" size={16} />;
      default:
        return <DollarSign className="text-gray-500" size={16} />;
    }
  };

  const getAmountColor = (type: string, amount: number) => {
    if (type === 'withdrawal') return 'text-red-600';
    if (type === 'interest') return 'text-blue-600';
    if (type === 'goal_reward') return 'text-purple-600';
    return 'text-green-600';
  };

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      date: transaction.date,
      description: transaction.description,
      memo: transaction.memo,
      type: transaction.type,
      amount: transaction.amount.toString()
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    onUpdateTransaction(editingId, {
      date: editForm.date,
      description: editForm.description,
      memo: editForm.memo,
      type: editForm.type,
      amount: parseFloat(editForm.amount) || 0
    });
    
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      date: '',
      description: '',
      memo: '',
      type: 'deposit',
      amount: ''
    });
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Transaction History</h3>
        <p className="text-sm text-gray-500 mt-1">Newest transactions first</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No transactions yet. Add your first transaction above!
                </td>
              </tr>
            ) : (
              sortedTransactions.map((transaction, index) => (
                <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {editingId === transaction.id ? (
                    // Edit mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.memo}
                          onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="deposit">Deposit</option>
                          <option value="withdrawal">Withdrawal</option>
                          <option value="interest">Interest</option>
                          <option value="goal_reward">Goal Reward</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900">
                        ${transaction.runningBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Save changes"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                            title="Cancel editing"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.memo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                          transaction.type === 'interest' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getAmountColor(transaction.type, transaction.amount)}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900">
                        ${transaction.runningBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => startEditing(transaction)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit transaction"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteTransaction(transaction.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}