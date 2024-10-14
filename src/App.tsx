import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Summary from './components/Summary'
import CategoryBudgets from './components/CategoryBudgets'
import MonthSelector from './components/MonthSelector'

export interface Expense {
  _id: string
  activity: string
  amount: number
  category: string
  created_at?: string
  updated_at?: string
}

export interface Income {
  _id: string
  amount: string
  created_at?: string
  updated_at?: string
}

interface CategoryBudget {
  _id: string
  category: string
  budget: number
  created_at?: string
  updated_at?: string
}

function App() {
  const [monthlyEarning, setMonthlyEarning] = useState<number>(0)
  const [incomeId, setIncomeId] = useState<string | null>(null);
  const [fetched, setFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))
  const [userEmail, setUserEmail] = useState('');
  const [userSecret, setUserSecret] = useState('');
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchExpenses(userId);
      fetchCategoryBudgets(userId);
      fetchIncome(userId);
      setFetched(true);
    }
  }, [selectedMonth, userId]);



  const addOrUpdateIncome = async () => {
    const method = incomeId ? 'PUT' : 'POST';
    const endpoint = incomeId ? `https://expense-app-eaq8.onrender.com/api/income/${incomeId}` : 'https://expense-app-eaq8.onrender.com/api/income';
    const response = await fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: monthlyEarning, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), userId: userId }),
    });
    const data = await response.json();
    if (!incomeId) {
      setIncomeId(data._id);  // Set incomeId if new income was added
    }
  };



  const fetchUserId = async () => {
    if (!userEmail) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://expense-app-eaq8.onrender.com/api/users?email=${encodeURIComponent(userEmail)}&secret=${userSecret}`);
      const data = await response.json();
      if (data._id) {
        localStorage.setItem('userId', data._id);
        setUserId(data._id);
        await fetchExpenses(data._id);
        await fetchCategoryBudgets(data._id);
        setFetched(true);
      }
    } catch (error) {
      console.error('Failed to fetch user ID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenses = async (userId: string) => {
    if (!userId) return;
    const response = await fetch(`https://expense-app-eaq8.onrender.com/api/expenses?month=${selectedMonth}&userId=${userId}`);
    const data = await response.json()
    setExpenses(data)
  }
  const fetchIncome = async (userId: string) => {
    if (!userId) return;
    const response = await fetch(`https://expense-app-eaq8.onrender.com/api/income?month=${selectedMonth}&userId=${userId}`);
    const data = await response.json()
    setIncomeId(data._id)
    setMonthlyEarning(data.amount)
  }

  const fetchCategoryBudgets = async (userId: string) => {
    if (!userId) return;
    const response = await fetch(`https://expense-app-eaq8.onrender.com/api/categoryBudgets?month=${selectedMonth}&userId=${userId}`);
    const data = await response.json()
    setCategoryBudgets(data)
  }

  const addExpense = async (expense: Omit<Expense, '_id'>) => {
    const response = await fetch('https://expense-app-eaq8.onrender.com/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expense, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), userId: userId }),
    })
    const newExpense = await response.json()
    setExpenses([...expenses, newExpense])
  }

  const removeExpense = async (id: string) => {
    await fetch(`https://expense-app-eaq8.onrender.com/api/expenses/${id}`, { method: 'DELETE' })
    setExpenses(expenses.filter(expense => expense._id !== id))
  }

  const editExpense = async (id: string, updatedExpense: Omit<Expense, '_id'>) => {
    const response = await fetch(`https://expense-app-eaq8.onrender.com/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...updatedExpense, updated_at: new Date().toISOString() }),
    })
    const editedExpense = await response.json()
    setExpenses(expenses.map(expense => expense._id === id ? editedExpense : expense))
  }

  const addCategoryBudget = async (categoryBudget: Omit<CategoryBudget, '_id'>) => {
    const response = await fetch('https://expense-app-eaq8.onrender.com/api/categoryBudgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...categoryBudget,created_at: new Date().toISOString(), updated_at: new Date().toISOString(), userId: userId }),
    })
    const newCategoryBudget = await response.json()
    setCategoryBudgets([...categoryBudgets, newCategoryBudget])
  }

  const removeCategoryBudget = async (id: string) => {
    await fetch(`https://expense-app-eaq8.onrender.com/api/categoryBudgets/${id}`, { method: 'DELETE' })
    setCategoryBudgets(categoryBudgets.filter(cb => cb._id !== id))
  }


  const editCategoryBudget = async (id: string, updatedCategoryBudget: Omit<CategoryBudget, '_id'>) => {
    const response = await fetch(`https://expense-app-eaq8.onrender.com/api/categoryBudgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...updatedCategoryBudget, updated_at: new Date().toISOString() }),
    })
    const editedCategoryBudget = await response.json()
    setCategoryBudgets(categoryBudgets.map(cb => cb._id === id ? editedCategoryBudget : cb))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingAmount = monthlyEarning - totalExpenses

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Monthly Expense Logger</h1>

        <div className="mb-6">
          <label htmlFor="monthlyEarning" className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Earning
          </label>
          <div className="relative rounded-md shadow-sm ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              &#8358;
            </div>
            <input
                type="number"
                id="monthlyEarning"
                className="
                shadow appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                value={monthlyEarning}
                onBlur={addOrUpdateIncome}
                onChange={(e) => setMonthlyEarning(Number(e.target.value))}
            />
          </div>
        </div>
        {!userId && <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
                type="email"
                id="userEmail"
                className="
              shadow appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="user@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="userSecret" className="block text-sm font-medium text-gray-700 mb-2">
              Secret Key
            </label>
            <input
                type="text"
                id="userSecret"
                className="
              shadow appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Your Secret Key"
                value={userSecret}
                onChange={(e) => setUserSecret(e.target.value)}
            />
          </div>
        </div>
        }
        <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth}/>
        {fetched && (<>


          <CategoryBudgets
              categoryBudgets={categoryBudgets}
              onAddCategoryBudget={addCategoryBudget}
              onRemoveCategoryBudget={removeCategoryBudget}
              onEditCategoryBudget={editCategoryBudget}
          />

          <ExpenseForm onAddExpense={addExpense} categories={categoryBudgets.map(cb => cb.category)}/>
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
              monthlyEarning={monthlyEarning}
          />
        </>)}
        <button onClick={fetchUserId}
                disabled={isLoading}
                className={`mt-4 ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}>
          {isLoading ? 'Loading...' : 'Load Expenses'}
        </button>
      </div>
    </div>
  )
}

export default App