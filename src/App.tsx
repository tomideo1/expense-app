import React, { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Summary from './components/Summary'
import CategoryBudgets from './components/CategoryBudgets'

interface Expense {
  _id: string
  activity: string
  amount: number
  category: string
}

interface CategoryBudget {
  _id: string
  category: string
  budget: number
}

function App() {
  const [monthlyEarning, setMonthlyEarning] = useState<number>(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([])

  useEffect(() => {
    fetchExpenses()
    fetchCategoryBudgets()
  }, [])

  const fetchExpenses = async () => {
    const response = await fetch('http://localhost:5000/api/expenses')
    const data = await response.json()
    setExpenses(data)
  }

  const fetchCategoryBudgets = async () => {
    const response = await fetch('http://localhost:5000/api/categoryBudgets')
    const data = await response.json()
    setCategoryBudgets(data)
  }

  const addExpense = async (expense: Omit<Expense, '_id'>) => {
    const response = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
    const newExpense = await response.json()
    setExpenses([...expenses, newExpense])
  }

  const removeExpense = async (id: string) => {
    await fetch(`http://localhost:5000/api/expenses/${id}`, { method: 'DELETE' })
    setExpenses(expenses.filter(expense => expense._id !== id))
  }

  const editExpense = async (id: string, updatedExpense: Omit<Expense, '_id'>) => {
    const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedExpense),
    })
    const editedExpense = await response.json()
    setExpenses(expenses.map(expense => expense._id === id ? editedExpense : expense))
  }

  const addCategoryBudget = async (categoryBudget: Omit<CategoryBudget, '_id'>) => {
    const response = await fetch('http://localhost:5000/api/categoryBudgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryBudget),
    })
    const newCategoryBudget = await response.json()
    setCategoryBudgets([...categoryBudgets, newCategoryBudget])
  }

  const removeCategoryBudget = async (id: string) => {
    await fetch(`http://localhost:5000/api/categoryBudgets/${id}`, { method: 'DELETE' })
    setCategoryBudgets(categoryBudgets.filter(cb => cb._id !== id))
  }

  const editCategoryBudget = async (id: string, updatedCategoryBudget: Omit<CategoryBudget, '_id'>) => {
    const response = await fetch(`http://localhost:5000/api/categoryBudgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCategoryBudget),
    })
    const editedCategoryBudget = await response.json()
    setCategoryBudgets(categoryBudgets.map(cb => cb._id === id ? editedCategoryBudget : cb))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingAmount = monthlyEarning - totalExpenses

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Monthly Expense Calculator</h1>
        
        <div className="mb-6">
          <label htmlFor="monthlyEarning" className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Earning
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="monthlyEarning"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={monthlyEarning}
              onChange={(e) => setMonthlyEarning(Number(e.target.value))}
            />
          </div>
        </div>

        <CategoryBudgets
          categoryBudgets={categoryBudgets}
          onAddCategoryBudget={addCategoryBudget}
          onRemoveCategoryBudget={removeCategoryBudget}
          onEditCategoryBudget={editCategoryBudget}
        />

        <ExpenseForm onAddExpense={addExpense} categories={categoryBudgets.map(cb => cb.category)} />
        <ExpenseList
          expenses={expenses}
          onRemoveExpense={removeExpense}
          onEditExpense={editExpense}
          categories={categoryBudgets.map(cb => cb.category)}
          categoryBudgets={categoryBudgets}
        />
        <Summary
          totalExpenses={totalExpenses}
          remainingAmount={remainingAmount}
          expenses={expenses}
          categoryBudgets={categoryBudgets}
        />
      </div>
    </div>
  )
}

export default App