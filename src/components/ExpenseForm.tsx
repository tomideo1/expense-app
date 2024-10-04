import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'

interface ExpenseFormProps {
  onAddExpense: (expense: { activity: string; amount: number; category: string }) => void
  categories: string[]
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, categories }) => {
  const [activity, setActivity] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activity && amount && category) {
      onAddExpense({ activity, amount: Number(amount), category })
      setActivity('')
      setAmount('')
      setCategory('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm