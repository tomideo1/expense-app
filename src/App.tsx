import React, { useState, useRef } from 'react'
import { DollarSign, Download, Upload } from 'lucide-react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Summary from './components/Summary'
import CategoryBudgets from './components/CategoryBudgets'

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

function App() {
  const [monthlyEarning, setMonthlyEarning] = useState<number>(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }])
  }

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const editExpense = (id: number, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ))
  }

  const addCategoryBudget = (categoryBudget: CategoryBudget) => {
    setCategoryBudgets([...categoryBudgets, categoryBudget])
  }

  const removeCategoryBudget = (category: string) => {
    setCategoryBudgets(categoryBudgets.filter(cb => cb.category !== category))
  }

  const editCategoryBudget = (oldCategory: string, updatedCategoryBudget: CategoryBudget) => {
    setCategoryBudgets(categoryBudgets.map(cb =>
      cb.category === oldCategory ? updatedCategoryBudget : cb
    ))
    // Update expense categories if the category name has changed
    if (oldCategory !== updatedCategoryBudget.category) {
      setExpenses(expenses.map(expense =>
        expense.category === oldCategory
          ? { ...expense, category: updatedCategoryBudget.category }
          : expense
      ))
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingAmount = monthlyEarning - totalExpenses

  const exportExpenses = () => {
    const data = JSON.stringify({ expenses, categoryBudgets, monthlyEarning })
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importExpenses = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const { expenses: importedExpenses, categoryBudgets: importedBudgets, monthlyEarning: importedEarning } = JSON.parse(content)
          setExpenses(importedExpenses)
          setCategoryBudgets(importedBudgets)
          setMonthlyEarning(importedEarning)
        } catch (error) {
          console.error('Error importing expenses:', error)
          alert('Error importing expenses. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

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

        <div className="flex justify-between mb-6">
          <button
            onClick={exportExpenses}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Expenses
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importExpenses}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import Expenses
          </button>
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