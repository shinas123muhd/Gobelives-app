const ProgressBar = ({ label, value, maxValue = 5 }) => {
    const percentage = (value / maxValue) * 100;
    
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300 w-32">{label}</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-yellow-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-300 w-8 text-right">{value.toFixed(1)}</span>
      </div>
    );
  };
  

export default ProgressBar