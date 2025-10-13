import React from 'react';

const ActivitiesFilter = ({ activities }) => (
  <div className="mb-6 bg-[#0F1B17]  py-2 rounded-xl">
    <h3 className="text-lg font-semibold py-2 px-4 border-b border-white/24">Activities</h3>
    <div className="space-y-2 px-2 py-2">
      {activities.map((activity, index) => (
        <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded">
          <div className="flex items-center">
            <input type="checkbox" className="mr-3 text-blue-500 focus:ring-blue-500" />
            <span className="text-sm">{activity.name}</span>
          </div>
          <span className="text-gray-400 text-sm">{activity.count}</span>
        </label>
      ))}
    </div>
  </div>
);

export default ActivitiesFilter;