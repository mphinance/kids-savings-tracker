import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, Calculator, Edit3, Save, X, Trash2, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

// Custom UI components with dark theme
const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-2xl font-semibold text-white ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-300 ${className}`}>
    {children}
  </label>
);

const Input = ({ id, type, value, onChange, placeholder, step, className = "", ...props }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    step={step}
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Button = ({ children, onClick, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors px-4 py-2";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    purple: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Select = ({ value, onValueChange, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
      >
        <span>{value}</span>
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
          {React.Children.map(children, child => 
            React.cloneElement(child, { 
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              }
            })
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick }) => (
  <div 
    className="px-3 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
);

const Progress = ({ value, className = "" }) => (
  <div className={`relative w-full h-3 bg-gray-700 rounded-full ${className}`}>
    <div
      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

const InputField = ({ label, type, value, onChange, placeholder, step, id, className = "" }) => (
  <div className="flex flex-col space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input 
      id={id} 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      step={step} 
      className={className}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, id }) => (
  <div className="flex flex-col space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  </div>
);

export default function App() {
  // State variables for the account details and transactions
  const [childName, setChildName] = useState("Leo");
  const [accountName, setAccountName] = useState("Leo's Bank");
  const [savingsRate, setSavingsRate] = useState(2); // as a percentage, now explicitly weekly
  const [goalAmount, setGoalAmount] = useState(100);
  const [transactions, setTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null); // Track which transaction is being edited

  // State for the new transaction form
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    memo: "",
    type: "Deposit",
    amount: 0,
  });

  // Effect to recalculate the balance and progress whenever transactions or goals change
  useEffect(() => {
    let balance = 0;
    transactions.forEach(t => {
      if (t.type === "Deposit" || t.type === "Interest") {
        balance += t.amount;
      } else if (t.type === "Withdrawal") {
        balance -= t.amount;
      }
    });
    setCurrentBalance(balance);
    
    // Calculate progress towards goal
    if (goalAmount > 0) {
      const percentage = (balance / goalAmount) * 100;
      setProgressPercentage(Math.min(percentage, 100)); // Cap at 100%
    } else {
      setProgressPercentage(0);
    }
  }, [transactions, goalAmount]);

  // Handle changes to the new transaction form
  const handleNewTransactionChange = (e) => {
    const { id, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [id]: id === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle select change for transaction type
  const handleSelectChange = (value) => {
    setNewTransaction(prev => ({ ...prev, type: value }));
  };

  // Add or update a transaction
  const handleSaveTransaction = () => {
    if (newTransaction.amount > 0 && newTransaction.description) {
      if (editingIndex !== null) {
        // Update existing transaction
        const updatedTransactions = transactions.map((t, index) => 
          index === editingIndex ? newTransaction : t
        );
        setTransactions(updatedTransactions);
        setEditingIndex(null); // Exit edit mode
      } else {
        // Add new transaction
        setTransactions(prev => [...prev, newTransaction]);
      }
      // Clear the form
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: "",
        memo: "",
        type: "Deposit",
        amount: 0,
      });
    }
  };

  // Start editing a transaction
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setNewTransaction(transactions[index]);
  };
  
  // Delete a transaction
  const handleDeleteClick = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    // Clear editing state if the deleted transaction was being edited
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: "",
        memo: "",
        type: "Deposit",
        amount: 0,
      });
    }
  };

  // Cancel editing and clear the form
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: "",
      memo: "",
      type: "Deposit",
      amount: 0,
    });
  };

  // This function is for paying the weekly interest allowance. It now backdates payments.
  const handlePayAllowance = () => {
    // First, sort all existing transactions by date to ensure accurate compounding.
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find the date of the most recent "Interest" payment.
    const lastInterestPayment = sortedTransactions.findLast(t => t.type === 'Interest');
    const today = new Date();
    
    // Determine the date to start backdating from.
    let startDate;
    if (lastInterestPayment) {
        startDate = new Date(lastInterestPayment.date);
    } else if (sortedTransactions.length > 0) {
        // If no interest payments, start from the date of the first transaction.
        startDate = new Date(sortedTransactions[0].date);
    } else {
        // If there are no transactions, there is no balance to pay interest on.
        return;
    }

    let tempTransactions = [...sortedTransactions];
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    
    // Calculate how many full weeks have passed since the last payment.
    const msSinceLastPayment = today.getTime() - startDate.getTime();
    const weeksToAdd = Math.floor(msSinceLastPayment / oneWeekInMs);
    
    if (weeksToAdd <= 0) {
        // No new weeks have passed, so no new interest to pay.
        return;
    }

    // Recalculate the balance up to the `startDate` to ensure correct compounding.
    let runningBalanceForBackdate = 0;
    tempTransactions.forEach(t => {
        if (new Date(t.date) <= startDate) {
            if (t.type === "Deposit" || t.type === "Interest") {
                runningBalanceForBackdate += t.amount;
            } else if (t.type === "Withdrawal") {
                runningBalanceForBackdate -= t.amount;
            }
        }
    });

    // Loop through each week and add a new interest transaction.
    for (let i = 0; i < weeksToAdd; i++) {
        // Calculate the date for the new interest transaction.
        const newDate = new Date(startDate.getTime() + (i + 1) * oneWeekInMs);
        const interestAmount = runningBalanceForBackdate * (savingsRate / 100);
        
        // Add the interest to the running balance for the next week's calculation (compounding).
        runningBalanceForBackdate += interestAmount;

        const newAllowance = {
            date: newDate.toISOString().split('T')[0],
            description: "Weekly Interest Payment",
            memo: `Weekly interest payment at ${savingsRate}% on current balance`,
            type: "Interest",
            amount: parseFloat(interestAmount.toFixed(2)),
        };
        tempTransactions.push(newAllowance);
    }

    // Set the state with all transactions, including the new backdated ones.
    setTransactions(tempTransactions);
  };

  // Calculate the running balance for each transaction in the table
  const calculateRunningBalance = (index) => {
    let balance = 0;
    for (let i = 0; i <= index; i++) {
      const t = transactions[i];
      if (t.type === "Deposit" || t.type === "Interest") {
        balance += t.amount;
      } else if (t.type === "Withdrawal") {
        balance -= t.amount;
      }
    }
    return balance.toFixed(2);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return <TrendingUp className="text-green-400" size={16} />;
      case 'Withdrawal':
        return <TrendingDown className="text-red-400" size={16} />;
      case 'Interest':
        return <DollarSign className="text-blue-400" size={16} />;
      default:
        return <DollarSign className="text-gray-400" size={16} />;
    }
  };

  const getAmountColor = (type) => {
    if (type === 'Withdrawal') return 'text-red-400';
    if (type === 'Interest') return 'text-blue-400';
    return 'text-green-400';
  };

  // Sort transactions by date (newest first) for display
  const sortedTransactionsForDisplay = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
            <PiggyBank className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {accountName} for {childName}
          </h1>
        </div>

        {/* Account Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
            <CardContent className="p-6 text-center">
              <p className="text-blue-100 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-white">${currentBalance.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
            <CardContent className="p-6 text-center">
              <p className="text-green-100 text-sm">Weekly Savings Rate</p>
              <p className="text-3xl font-bold text-white">{savingsRate}%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
            <CardContent className="p-6 text-center">
              <p className="text-purple-100 text-sm">Goal Amount</p>
              <p className="text-3xl font-bold text-white">${goalAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500">
            <CardContent className="p-6 text-center">
              <p className="text-yellow-100 text-sm">Goal Progress</p>
              <Progress value={progressPercentage} className="mt-2" />
              <p className="text-xl font-bold text-white mt-2">{progressPercentage.toFixed(1)}%</p>
              {progressPercentage >= 100 && (
                <p className="text-yellow-200 font-semibold mt-1 animate-pulse">🎉 Goal Achieved! 🎉</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputField 
                id="childName" 
                label="Child's Name" 
                type="text" 
                value={childName} 
                onChange={(e) => setChildName(e.target.value)} 
                placeholder="e.g., Leo"
              />
              <InputField 
                id="accountName" 
                label="Account Name" 
                type="text" 
                value={accountName} 
                onChange={(e) => setAccountName(e.target.value)} 
                placeholder="e.g., Leo's Bank"
              />
              <InputField 
                id="savingsRate" 
                label="Weekly Savings Rate (%)" 
                type="number" 
                value={savingsRate} 
                onChange={(e) => setSavingsRate(parseFloat(e.target.value) || 0)} 
                placeholder="e.g., 2.5"
                step="0.01"
              />
              <InputField 
                id="goalAmount" 
                label="Goal ($)" 
                type="number" 
                value={goalAmount} 
                onChange={(e) => setGoalAmount(parseFloat(e.target.value) || 0)} 
                placeholder="e.g., 100"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus size={20} />
                  {editingIndex !== null ? 'Edit Transaction' : 'Add Transaction'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputField 
                  id="date" 
                  label="Date" 
                  type="date" 
                  value={newTransaction.date} 
                  onChange={handleNewTransactionChange} 
                />
                <InputField 
                  id="description" 
                  label="Description" 
                  type="text" 
                  value={newTransaction.description} 
                  onChange={handleNewTransactionChange} 
                  placeholder="e.g., Weekly allowance"
                />
                <InputField 
                  id="memo" 
                  label="Memo" 
                  type="text" 
                  value={newTransaction.memo} 
                  onChange={handleNewTransactionChange} 
                  placeholder="Additional notes (optional)"
                />
                <SelectField
                  id="type"
                  label="Type"
                  value={newTransaction.type}
                  onChange={handleSelectChange}
                  options={[
                    { value: "Deposit", label: "Deposit" },
                    { value: "Withdrawal", label: "Withdrawal" },
                  ]}
                />
                <InputField 
                  id="amount" 
                  label="Amount ($)" 
                  type="number" 
                  value={newTransaction.amount === 0 ? "" : newTransaction.amount} 
                  onChange={handleNewTransactionChange} 
                  placeholder="0.00"
                  step="0.01"
                />
                
                <div className="flex gap-2">
                  <Button onClick={handleSaveTransaction} className="flex-1">
                    {editingIndex !== null ? (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Add Transaction
                      </>
                    )}
                  </Button>
                  {editingIndex !== null && (
                    <Button onClick={handleCancelEdit} variant="secondary">
                      <X size={16} />
                    </Button>
                  )}
                </div>
                
                <Button 
                  onClick={handlePayAllowance} 
                  variant="success" 
                  className="w-full"
                >
                  <Calculator size={16} className="mr-2" />
                  Pay Weekly Interest
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <p className="text-sm text-gray-400">Newest transactions first</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {sortedTransactionsForDisplay.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                            No transactions yet. Add your first transaction above!
                          </td>
                        </tr>
                      ) : (
                        sortedTransactionsForDisplay.map((transaction, displayIndex) => {
                          // Find the original index for balance calculation
                          const originalIndex = transactions.findIndex(t => 
                            t.date === transaction.date && 
                            t.description === transaction.description && 
                            t.amount === transaction.amount
                          );
                          
                          return (
                            <tr key={`${transaction.date}-${displayIndex}`} className="hover:bg-gray-700/50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                  {getTransactionIcon(transaction.type)}
                                  <div>
                                    <div>{transaction.description}</div>
                                    {transaction.memo && (
                                      <div className="text-xs text-gray-500">{transaction.memo}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  transaction.type === 'Withdrawal' ? 'bg-red-900 text-red-200' :
                                  transaction.type === 'Interest' ? 'bg-blue-900 text-blue-200' :
                                  'bg-green-900 text-green-200'
                                }`}>
                                  {transaction.type}
                                </span>
                              </td>
                              <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-right ${getAmountColor(transaction.type)}`}>
                                {transaction.type === 'Withdrawal' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-right text-white">
                                ${calculateRunningBalance(originalIndex)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center gap-1">
                                  <button
                                    onClick={() => handleEditClick(originalIndex)}
                                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Edit transaction"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(originalIndex)}
                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete transaction"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Footer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">💡 How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <strong className="text-white">Weekly Interest:</strong> Your money grows by {savingsRate}% every week. 
                The more you save, the more interest you earn!
              </div>
              <div>
                <strong className="text-white">Compound Growth:</strong> Interest is calculated on your total balance, 
                including previous interest payments. This means your savings grow faster over time!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}