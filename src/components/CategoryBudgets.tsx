import React, { useState } from 'react'
import { PlusCircle, MinusCircle, Edit2 } from 'lucide-react'
import { formatNumber } from '../helpers/util.ts';

interface CategoryBudget {
  _id: string;
  category: string
  budget: number
}




const CategoryBudgets: React.FC<{
  categoryBudgets: CategoryBudget[];
  onAddCategoryBudget: (categoryBudget: Omit<CategoryBudget, '_id'>) => void;
  onRemoveCategoryBudget: (id: string) => void;
  onEditCategoryBudget: (id: string, updatedCategoryBudget: Omit<CategoryBudget, '_id'>) => void;
}> = ({
    categoryBudgets,
    onAddCategoryBudget,
    onRemoveCategoryBudget,
    onEditCategoryBudget,
      }) => {
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedCategory, setEditedCategory] = useState('');
  const [editedBudget, setEditedBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && newBudget) {
      onAddCategoryBudget({ category: newCategory, budget: Number(newBudget) });
      setNewCategory('');
      setNewBudget('');
    }
  };

  const handleEdit = (cb: CategoryBudget) => {
    setEditingId(cb._id);
    setEditedCategory(cb.category);
    setEditedBudget(cb.budget.toString());
  };

  const handleSaveEdit = (id: string) => {
    if (editedCategory && editedBudget) {
      onEditCategoryBudget(id, { category: editedCategory, budget: Number(editedBudget) });
      setEditingId(null);
    }
  };

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
            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
          />
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              ₦
            </div>
            <input
              type="number"
              placeholder="Budget"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pl-7 p-2"
            />
          </div>
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
          <li key={cb._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
            {editingId === cb._id ? (
              <>
                <input
                  type="text"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2 p-2"
                />
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    ₦
                  </div>
                  <input
                    type="number"
                    value={editedBudget}
                    onChange={(e) => setEditedBudget(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pl-7 p-2 mr-2"
                  />
                </div>
                <button
                  onClick={() => handleSaveEdit(cb._id)}
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
                <span>{cb.category}</span>
                <div className="flex items-center">
                  <span className="font-medium mr-4">{formatNumber(cb.budget)}</span>
                  <button
                    onClick={() => handleEdit(cb)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onRemoveCategoryBudget(cb._id)}
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
  );
}

export default CategoryBudgets