import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthSelectorProps {
  selectedMonth: string
  onSelectMonth: (month: string) => void
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onSelectMonth }) => {
  const handlePreviousMonth = () => {
    const date = new Date(selectedMonth)
    date.setMonth(date.getMonth() - 1)
    onSelectMonth(date.toISOString().slice(0, 7))
  }

  const handleNextMonth = () => {
    const date = new Date(selectedMonth)
    date.setMonth(date.getMonth() + 1)
    onSelectMonth(date.toISOString().slice(0, 7))
  }

  return (
    <div className="flex items-center justify-center mb-6">
      <button
        onClick={handlePreviousMonth}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h2 className="text-xl font-semibold mx-4">
        {new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}

export default MonthSelector