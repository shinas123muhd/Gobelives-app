import React from 'react';

const BudgetFilter = ({ options, selectedBudget, setSelectedBudget }) => (
  <div className="mb-6 bg-[#0F1B17] py-2 rounded-xl">
    <h3 className="text-lg font-semibold py-2 px-4 border-b border-white/24">
      Your budget per day
    </h3>
    <div className="space-y-2 px-2 py-2">
      {options.map((budget, index) => (
        <label
          key={index}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded"
        >
          <div className="flex items-center">
            <input
              type="checkbox" 
              name="budget"
              value={budget.range}
              checked={selectedBudget === budget.range}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="mr-3 text-blue-500 focus:ring-blue-500 rounded-sm" 
            />
            <span className="text-sm">{budget.range}</span>
          </div>
          <span className="text-gray-400 text-sm">{budget.count}</span>
        </label>
      ))}
    </div>
  </div>
);

export default BudgetFilter;