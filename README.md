# FormulaFit - Your Personal Fitness Companion 🏋️

A comprehensive health and fitness web application that helps users calculate calories, plan workouts, and track their nutrition journey — all without requiring any signup or login.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## ✨ Features

- **🔢 Calorie Calculator** - Calculate your daily calorie needs using the scientifically-backed Mifflin-St Jeor formula
- **💪 Workout Plans** - Get personalized workout routines based on your experience level and equipment
- **🥗 Food Guide** - Discover protein-rich foods categorized by dietary preferences
- **📊 Daily Tracker** - Log meals and track your daily calorie and protein intake
- **🔒 Privacy First** - All data stored locally in your browser, no servers involved

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or newer
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/sourabh/FormulaFit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
FormulaFit/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── calculator/        # Calorie calculator
│   ├── results/           # Results dashboard
│   ├── workout/           # Workout plan generator
│   ├── food-guide/        # Protein sources guide
│   └── tracker/           # Daily calorie tracker
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Header, Footer
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── localStorage.ts    # Browser storage utilities
│   ├── calculations.ts    # BMR, TDEE, macro formulas
│   └── workoutGenerator.ts # Workout plan logic
└── data/
    └── foods.json         # Protein sources database
```

## 🧮 Calculation Formulas

### BMR (Mifflin-St Jeor Formula)
- **Male:** BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
- **Female:** BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161

### TDEE Multipliers
| Activity Level | Multiplier |
|----------------|------------|
| Sedentary | 1.2 |
| Lightly Active | 1.375 |
| Moderately Active | 1.55 |
| Very Active | 1.725 |

### Goal Adjustments
| Goal | Adjustment |
|------|------------|
| Fat Loss | TDEE - 400 kcal |
| Weight Gain | TDEE + 400 kcal |
| Maintenance | TDEE |
| Recomposition | TDEE - 200 kcal |

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Storage:** Browser localStorage

## 📱 Features Overview

### Calorie Calculator
Enter your age, gender, height, weight, activity level, and fitness goal to get personalized calorie and macro recommendations.

### Workout Plans
Choose your training days, experience level, and equipment access to generate customized workout splits (Full Body, Upper/Lower, PPL).

### Food Guide
Browse protein-rich foods with filtering by dietary preference (Vegetarian, Non-Vegetarian, Vegan) and search functionality.

### Daily Tracker
Log meals with calories and protein, view progress bars against your targets, and track your history.

## 🔐 Privacy

- **No signup required** - Start using immediately
- **No backend** - All data stays on your device
- **No tracking** - We don't collect any analytics
- **Full control** - Clear your data anytime

## ⚠️ Disclaimer

This tool provides estimates for educational purposes only. The calculations are based on general formulas and may not account for individual variations. Always consult a healthcare professional or registered dietitian before starting any diet or exercise program.

## 📄 License

MIT License - feel free to use and modify for your needs.
