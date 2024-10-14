import React, { useState } from 'react'
import { PlusCircle, MinusCircle, Edit2 } from 'lucide-react'

interface CategoryBudget {
  category: string
  budget: number
}

interface CategoryBudgetsProps {
  categoryBudgets: CategoryBudget[]
  onAddCategoryBudget: (categoryBudget: CategoryBudget) => void
  onRemoveCategoryBudget: (category: string) => void
  onEditCategoryBudget: (oldCategory: string, updatedCategoryBudget: CategoryBudget) => void
}

const CategoryBudgets: React.FC<CategoryBudgetsProps> = ({
  categoryBudgets,
  onAddCategoryBudget,
  onRemoveCategoryBudget,
  onEditCategoryBudget,
}) => {
  const [newCategory, setNewCategory] = useState('')
  const [newBudget, setNewBudget] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editedCategory, setEditedCategory] = useState('')
  const [editedBudget, setEditedBudget] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory && newBudget) {
      onAddCategoryBudget({ category: newCategory, budget: Number(newBudget) })
      setNewCategory('')
      setNewBudget('')
    }
  }

  const handleEdit = (category: string, budget: number) => {
    setEditingCategory(category)
    setEditedCategory(category)
    setEditedBudget(budget.toString())
  }

  const handleSaveEdit = (oldCategory: string) => {
    if (editedCategory && editedBudget) {
      onEditCategoryBudget(oldCategory, { category: editedCategory, budget: Number(editedBudget) })
      setEditingCategory(null)
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Category Budgets</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Budget"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Category Budget
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {categoryBudgets.map((cb) => (
          <li key={cb.category} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
            {editingCategory === cb.category ? (
              <>
                <input
                  type="text"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                />
                <input
                  type="number"
                  value={editedBudget}
                  onChange={(e) => setEditedBudget(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                />
                <button
                  onClick={() => handleSaveEdit(cb.category)}
                  className="text-green-600 hover:text-green-800 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{cb.category}</span>
                <div className="flex items-center">
                  <span className="font-medium mr-4">&#8358;{cb.budget.toFixed(2)}</span>
                  <button
                    onClick={() => handleEdit(cb.category, cb.budget)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onRemoveCategoryBudget(cb.category)}
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
    </div>
  )
}

export default CategoryBudgets