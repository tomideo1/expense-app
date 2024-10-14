import React, { useState } from 'react'
import { MinusCircle, Edit2, ArrowUpDown } from 'lucide-react'
import { formatNumber } from '../helpers/util.ts';

interface Expense {
  _id: string
  activity: string
  amount: number
  category: string
  created_at: string
  updated_at: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onRemoveExpense: (id: string) => void
  onEditExpense: (id: string, updatedExpense: Omit<Expense, '_id'>) => void
  categories: string[]
  categoryBudgets: { category: string; budget: number, _id: string }[]
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onRemoveExpense, onEditExpense, categoryBudgets }) => {
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'category' | 'amount' | 'date' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  const groupExpensesByDate = () => {
    const groups: { [key: string]: Expense[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': [],
      'Older': []
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.created_at);
      if (expenseDate.toDateString() === today.toDateString()) {
        groups['Today'].push(expense);
      } else if (expenseDate.toDateString() === yesterday.toDateString()) {
        groups['Yesterday'].push(expense);
      } else if (expenseDate >= thisWeekStart) {
        groups['This Week'].push(expense);
      } else if (expenseDate >= thisMonthStart) {
        groups['This Month'].push(expense);
      } else {
        groups['Older'].push(expense);
      }
    });

    return groups;
  };




  const groupedExpenses = groupExpensesByDate();

  const toggleSort = (field: 'category' | 'amount' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };


  const getCategoryStatus = (category: string) => {
    const budget = categoryBudgets.find(cb => cb.category === category)?.budget || 0
    const totalExpense = expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)
    const percentage = (totalExpense / budget) * 100

    if (percentage >= 100) return 'danger'
    if (percentage >= 80) return 'warning'
    return 'normal'
  }

  return (
   <>
     <div className="mb-4 flex justify-between items-center">
       <div>
         <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-2">
           Filter by Category
         </label>
         <select
           id="filterCategory"
           value={filterCategory}
           onChange={(e) => setFilterCategory(e.target.value)}
           className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
         >
           <option value="">All Categories</option>
           {categoryBudgets.map((cb) => (
             <option key={cb._id} value={cb.category}>{cb.category}</option>
           ))}
         </select>
       </div>
       <div className="flex space-x-2">
         <button
           onClick={() => toggleSort('category')}
           className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
         >
           <ArrowUpDown className="h-4 w-4 mr-1" />
           Category
         </button>
         <button
           onClick={() => toggleSort('amount')}
           className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
         >
           <ArrowUpDown className="h-4 w-4 mr-1" />
           Amount
         </button>
         <button
           onClick={() => toggleSort('date')}
           className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
         >
           <ArrowUpDown className="h-4 w-4 mr-1" />
           Date
         </button>
       </div>
     </div>

     {Object.entries(groupedExpenses).map(([group, groupExpenses]) => (
       groupExpenses.length > 0 && (
         <div key={group} className="mb-6">
           <h3 className="text-lg font-semibold mb-2">{group}</h3>
           <ul className="space-y-2">
             {groupExpenses.filter(expense => !filterCategory || expense.category === filterCategory)
               .sort((a, b) => {
                 if (sortBy === 'category') {
                   return sortOrder === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
                 } else if (sortBy === 'amount') {
                   return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
                 } else if (sortBy === 'date') {
                   return sortOrder === 'asc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                 }
                 return 0;
               })
               .map((expense) => (
                 <li key={expense._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                   <div>
                     <span className="font-medium">{expense.activity}</span>
                     <span className={`text-sm ml-2 px-2 py-1 rounded-full ${
                       getCategoryStatus(expense.category) === 'danger' ? 'bg-red-100 text-red-800' :
                         getCategoryStatus(expense.category) === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                           'bg-green-100 text-green-800'
                     }`}>
                              {expense.category}
                            </span>
                   </div>
                   <div className="flex items-center">
                     <span className="font-medium mr-4">{formatNumber(expense.amount)}</span>
                     <button
                       onClick={() => onEditExpense(expense._id, expense)}
                       className="text-blue-600 hover:text-blue-800 mr-2"
                     >
                       <Edit2 className="h-5 w-5" />
                     </button>
                     <button
                       onClick={() => onRemoveExpense(expense._id)}
                       className="text-red-600 hover:text-red-800"
                     >
                       <MinusCircle className="h-5 w-5" />
                     </button>
                   </div>
                 </li>
               ))}
           </ul>
         </div>
       )
     ))}
   </>
  )
}

export default ExpenseList