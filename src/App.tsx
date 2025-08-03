import React, { useState, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';
import AccountHeader from './components/AccountHeader';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import { AccountSettings, Transaction } from './types';

function App() {
  const [settings, setSettings] = useState<AccountSettings>({
    childName: "Alex",
    accountName: "My Super Savings Account",
    savingsRate: 0.5, // 0.5% weekly rate
    compoundingPeriod: 'weekly',
    goal: 500.00
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('savingsSettings');
    const savedTransactions = localStorage.getItem('savingsTransactions');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save data to localStorage whenever settings or transactions change
  useEffect(() => {
    localStorage.setItem('savingsSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('savingsTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const currentBalance = transactions.reduce((balance, transaction) => {
    return transaction.type === 'withdrawal' 
      ? balance - transaction.amount 
      : balance + transaction.amount;
  }, 0);

  const addTransaction = (newTransaction: Omit<Transaction, 'id' | 'runningBalance'>) => {
    const id = Date.now().toString();
    
    // Calculate running balance based on chronological order
    const allTransactions = [...transactions, { ...newTransaction, id, runningBalance: 0 }]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let balance = 0;
    const updatedTransactions = allTransactions.map(t => {
      balance = t.type === 'withdrawal' ? balance - t.amount : balance + t.amount;
      return { ...t, runningBalance: balance };
    });
    
    const newTransactionWithBalance = updatedTransactions.find(t => t.id === id)!;

    // Update all transactions with recalculated balances
    setTransactions(updatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateTransaction = (id: string, updatedData: Omit<Transaction, 'id' | 'runningBalance'>) => {
    // Update the transaction and recalculate all balances
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...updatedData } : t
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let balance = 0;
    const recalculatedTransactions = updatedTransactions.map(t => {
      balance = t.type === 'withdrawal' ? balance - t.amount : balance + t.amount;
      return { ...t, runningBalance: balance };
    });
    
    setTransactions(recalculatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteTransaction = (id: string) => {
    // Remove transaction and recalculate all balances
    const remainingTransactions = transactions
      .filter(t => t.id !== id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let balance = 0;
    const recalculatedTransactions = remainingTransactions.map(t => {
      balance = t.type === 'withdrawal' ? balance - t.amount : balance + t.amount;
      return { ...t, runningBalance: balance };
    });
    
    setTransactions(recalculatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const calculateInterest = () => {
    if (currentBalance <= 0) return;

    let periodInterest = currentBalance * (settings.savingsRate / 100);
    let periodLabel: string;
    
    switch (settings.compoundingPeriod) {
      case 'weekly':
        periodLabel = 'Weekly';
        break;
      case 'monthly':
        periodInterest = periodInterest * 4; // 4 weeks in a month
        periodLabel = 'Monthly';
        break;
      case 'annually':
        periodInterest = periodInterest * 52; // 52 weeks in a year
        periodLabel = 'Annual';
        break;
      default:
        periodLabel = 'Weekly';
    }
    
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: `${periodLabel} Interest Payment`,
      memo: `${settings.savingsRate}% weekly rate applied to $${currentBalance.toFixed(2)}`,
      type: 'interest',
      amount: periodInterest
    });
  };

  const autoCalculateInterest = () => {
    if (transactions.length === 0) return;

    // Get the most recent transaction date
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastTransactionDate = new Date(sortedTransactions[0].date);
    const today = new Date();
    
    // Calculate how many periods have passed
    let periodLength: number;
    let periodLabel: string;
    
    switch (settings.compoundingPeriod) {
      case 'weekly':
        periodLength = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        periodLabel = 'Weekly';
        break;
      case 'monthly':
        periodLength = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        periodLabel = 'Monthly';
        break;
      case 'annually':
        periodLength = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
        periodLabel = 'Annual';
        break;
      default:
        periodLength = 7 * 24 * 60 * 60 * 1000;
        periodLabel = 'Weekly';
    }

    const timeDiff = today.getTime() - lastTransactionDate.getTime();
    const periodsToAdd = Math.floor(timeDiff / periodLength);

    if (periodsToAdd <= 0) return;

    // Create interest transactions for each period
    let newTransactions: Transaction[] = [];
    
    // Get all transactions in chronological order for proper balance calculation
    const chronologicalTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 1; i <= periodsToAdd; i++) {
      const interestDate = new Date(lastTransactionDate.getTime() + (i * periodLength));
      
      // Calculate balance at the time of this interest payment
      const balanceAtTime = chronologicalTransactions
        .filter(t => new Date(t.date).getTime() <= interestDate.getTime())
        .reduce((balance, t) => {
          return t.type === 'withdrawal' ? balance - t.amount : balance + t.amount;
        }, 0);
      
      // Add any previous interest payments from this auto-calculation
      const previousInterestFromThisRun = newTransactions
        .filter(t => new Date(t.date).getTime() < interestDate.getTime())
        .reduce((total, t) => total + t.amount, 0);
      
      const currentBalance = balanceAtTime + previousInterestFromThisRun;
      
      // Calculate interest based on current settings and balance at the time
      let periodInterest = currentBalance * (settings.savingsRate / 100);
      
      switch (settings.compoundingPeriod) {
        case 'weekly':
          // Use weekly rate as-is
          break;
        case 'monthly':
          periodInterest = periodInterest * 4; // 4 weeks in a month
          break;
        case 'annually':
          periodInterest = periodInterest * 52; // 52 weeks in a year
          break;
      }

      const transaction: Transaction = {
        id: `auto-${Date.now()}-${i}`,
        date: interestDate.toISOString().split('T')[0],
        description: `${periodLabel} Interest Payment (Auto)`,
        memo: `${settings.savingsRate}% weekly rate applied to $${currentBalance.toFixed(2)}`,
        type: 'interest',
        amount: periodInterest,
        runningBalance: 0 // Will be recalculated
      };

      newTransactions.push(transaction);
    }

    // Add all new transactions and recalculate balances
    const allTransactions = [...transactions, ...newTransactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let balance = 0;
    const recalculatedTransactions = allTransactions.map(t => {
      balance = t.type === 'withdrawal' ? balance - t.amount : balance + t.amount;
      return { ...t, runningBalance: balance };
    });
    
    // Sort by newest first for display
    setTransactions(recalculatedTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
            <PiggyBank className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Savings Tracker</h1>
        </div>

        {/* Account Overview */}
        <div className="mb-8">
          <AccountHeader 
            settings={settings}
            currentBalance={currentBalance}
            onSettingsChange={setSettings}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm 
              onAddTransaction={addTransaction}
              onCalculateInterest={calculateInterest}
              onAutoInterest={autoCalculateInterest}
              currentBalance={currentBalance}
              savingsRate={settings.savingsRate}
              compoundingPeriod={settings.compoundingPeriod}
            />
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <TransactionHistory 
              transactions={transactions}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>

        {/* Educational Footer */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Savings Rate:</strong> Your money grows by {settings.savingsRate}% per week. 
              The more you save, the more interest you earn!
            </div>
            <div>
              <strong>{settings.compoundingPeriod.charAt(0).toUpperCase() + settings.compoundingPeriod.slice(1)} Interest:</strong> Click "Add Interest" to apply your {settings.compoundingPeriod} earnings 
              (about ${(() => {
                let weeklyInterest = (currentBalance * (settings.savingsRate / 100));
                switch (settings.compoundingPeriod) {
                  case 'weekly':
                    return weeklyInterest.toFixed(2);
                  case 'monthly':
                    return (weeklyInterest * 4).toFixed(2);
                  case 'annually':
                    return (weeklyInterest * 52).toFixed(2);
                  default:
                    return weeklyInterest.toFixed(2);
                }
              })()} this period).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;