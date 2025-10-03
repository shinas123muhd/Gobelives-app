"use client"
import { useState } from "react";

export function ShareExpensesCard({
    personCount = 1,
    pricePerPerson = 120.32,
    taxAndFees = 9.68,
    onSplit = () => {}
  }) {
    const [numPeople, setNumPeople] = useState('2');
    const total = pricePerPerson + taxAndFees;
  
    return (
      <div className="bg-black rounded-2xl p-5 shadow-xl max-w-sm space-y-4">
        {/* Header */}
        <div className="bg-[#FF9500] text-white font-bold px-5 py-3 rounded-t-2xl -mt-5 -mx-5 mb-4">
          Share Expenses
        </div>
  
        {/* Share Expense Section */}
        <div className="space-y-3">
          <label className="block text-gray-300 text-sm font-medium">Share Expense</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              placeholder="Number Of Persons"
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={() => onSplit(numPeople)}
              className="bg-[#0F1B17] hover:bg-[#FFD700] text-[#FFD700] whitespace-nowrap hover:text-[#0F1B17] font-semibold px-6 py-2 rounded-lg  transition-colors"
            >
              Split
            </button>
          </div>
        </div>
  
        {/* Divider */}
        <div className="border-t border-gray-700"></div>
  
        {/* Person Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Person 1</span>
            <span className="text-white font-semibold">${pricePerPerson.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Tax and service fees</span>
            <span className="text-white font-semibold">${taxAndFees.toFixed(2)}</span>
          </div>
        </div>
  
        {/* Divider */}
        <div className="border-t border-gray-700"></div>
  
        {/* Total */}
        <div className="flex justify-between">
          <span className="text-white text-lg font-bold">Total</span>
          <span className="text-white text-2xl font-bold">${total.toFixed(0)}</span>
        </div>
      </div>
    );
  }