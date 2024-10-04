import React from 'react'

interface Expense {
  id: number
  activity: string
  amount: number
  category: string
}

interface CategoryBudget {
  category: string
  budget: number
}

interface SummaryProps {
  totalExpenses: number
  remainingAmount: number
  expenses: Expense[]
  categoryBudgets: CategoryBudget[]
}

const Summary: React.FC<SummaryProps> = ({ totalExpenses, remainingAmount, expenses, categoryBudgets }) => {
  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-3">Summary</h2>
      <div className="flex justify-between text-lg">
        <span>Total Expenses:</span>
        <span className="font-medium">${totalExpenses.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg mt-2">
        <span>Remaining Amount:</span>
        <span className={`font-medium ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${remainingAmount.toFixed(2)}
        </span>
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2">Category Breakdown:</h3>
      <ul className="space-y-2">
        {categoryBudgets.map((cb) => (
          <li key={cb.category} className="flex justify-between items-center">
            <span>{cb.category}</span>
            <div>
              <span className="font-medium">${categoryExpenses[cb.category]?.toFixed(2) || '0.00'}</span>
              <span className="text-gray-500 ml-2">/ ${cb.budget.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Summary