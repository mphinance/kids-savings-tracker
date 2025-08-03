# Child Savings Tracker

A React-based savings tracker app that teaches kids about money management and compound interest through an interactive, gamified experience.

## 🚀 Usage

### For Parents & Kids (Non-Technical)
1. **Set up your account** - Enter your child's name, account name, weekly interest rate, and savings goal
2. **Add transactions** - Record deposits (allowance, gifts, chores) and withdrawals (purchases)
3. **Pay weekly interest** - Click "Pay Weekly Interest" to automatically calculate and add compound interest
4. **Track progress** - Watch the progress bar fill up as you get closer to your savings goal
5. **Learn about money** - See how compound interest makes your money grow faster over time

### For Developers (Technical)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app uses React hooks for state management, calculates compound interest with proper backdating, and features a responsive dark theme UI built with Tailwind CSS.

## 🎯 Key Features

- **Weekly compound interest** with automatic backdating
- **Goal tracking** with visual progress indicators  
- **Transaction history** with running balance calculations
- **Responsive dark theme** UI
- **Educational tooltips** explaining financial concepts

## 🛠️ Tech Stack

- React 18 with hooks
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

## 📱 Live Demo

Visit the live app: [Child Savings Tracker](https://classy-creponne-37ac0b.netlify.app)

## 💡 How It Works

The app calculates weekly compound interest by:
1. Finding the last interest payment date
2. Calculating weeks elapsed since then
3. Applying interest week-by-week with proper compounding
4. Automatically backdating missed payments

Perfect for teaching kids that saving money early and consistently leads to exponential growth through compound interest!