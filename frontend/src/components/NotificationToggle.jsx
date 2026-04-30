import React, { useState } from 'react';

const NotificationToggle = ({ label, description, initialValue = false, onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all group">
      <div className="space-y-1">
        <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      
      <button 
        onClick={handleToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-emerald-500 ${
          isEnabled ? 'bg-emerald-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationToggle;
