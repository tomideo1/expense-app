import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatNumber } from '../helpers/util.ts';

interface Expense {
  _id: string
  activity: string
  amount: number
  category: string
}

interface CategoryBudget {
  category: string
  budget: number
}



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#A52A2A', '#DDA0DD', '#FF69B4']

const Summary: React.FC<{
  totalExpenses: number;
  remainingAmount: number;
  expenses: Expense[];
  categoryBudgets: CategoryBudget[];
  monthlyEarning: number;
}> = ({ totalExpenses, remainingAmount, expenses, categoryBudgets, monthlyEarning }) => {
  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryExpenses).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const getCategoryStatus = (_: string, spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const savingsPercentage = (remainingAmount / monthlyEarning) * 100;

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-3">Summary</h2>
      <div className="flex justify-between text-lg">
        <span>Total Expenses:</span>
        <span className="font-medium">{formatNumber(totalExpenses)}</span>
      </div>
      <div className="flex justify-between text-lg mt-2">
        <span>Remaining Amount:</span>
        <span className={`font-medium ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatNumber(remainingAmount)}
          </span>
      </div>
      <div className="flex justify-between text-lg mt-2">
        <span>Savings Percentage:</span>
        <span className={`font-medium ${savingsPercentage >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
            {savingsPercentage.toFixed(2)}%
          </span>
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2">Category Breakdown:</h3>
      <ul className="space-y-2">
        {categoryBudgets.map((cb) => {
          const spent = categoryExpenses[cb.category] || 0;
          const percentage = (spent / cb.budget) * 100;
          return (
            <li key={cb.category} className="flex justify-between items-center">
              <span>{cb.category}</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className={`h-2.5 rounded-full ${
                      percentage >= 100 ? 'bg-red-600' : percentage >= 80 ? 'bg-yellow-400' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <span className={`font-medium ${getCategoryStatus(cb.category, spent, cb.budget)}`}>
                    {formatNumber(spent)}
                  </span>
                <span className="text-gray-500 ml-2">/ {formatNumber(cb.budget)}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <h3 className="text-lg font-semibold mt-6 mb-4">Expense Distribution:</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatNumber(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Summary