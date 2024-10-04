import React, { useState } from 'react'
import { MinusCircle, Edit2 } from 'lucide-react'

interface Expense {
  id: number
  activity: string
  amount: number
  category: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onRemoveExpense: (id: number) => void
  onEditExpense: (id: number, updatedExpense: Omit<Expense, 'id'>) => void
  categories: string[]
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onRemoveExpense, onEditExpense, categories }) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedActivity, setEditedActivity] = useState('')
  const [editedAmount, setEditedAmount] = useState('')
  const [editedCategory, setEditedCategory] = useState('')

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setEditedActivity(expense.activity)
    setEditedAmount(expense.amount.toString())
    setEditedCategory(expense.category)
  }

  const handleSaveEdit = (id: number) => {
    if (editedActivity && editedAmount && editedCategory) {
      onEditExpense(id, {
        activity: editedActivity,
        amount: Number(editedAmount),
        category: editedCategory,
      })
      setEditingId(null)
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses added yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
              {editingId === expense.id ? (
                <>
                  <input
                    type="text"
                    value={editedActivity}
                    onChange={(e) => setEditedActivity(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                  />
                  <select
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSaveEdit(expense.id)}
                    className="text-green-600 hover:text-green-800 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-medium">{expense.activity}</span>
                    <span className="text-sm text-gray-500 ml-2">({expense.category})</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-4">${expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onRemoveExpense(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ExpenseList