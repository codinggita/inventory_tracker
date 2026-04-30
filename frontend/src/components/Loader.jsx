import React from 'react';

const Loader = ({ fullPage = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-emerald-600 animate-spin"></div>
        <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-emerald-200 animate-spin absolute top-0 left-0 opacity-50"></div>
      </div>
      <p className="text-emerald-600 font-medium animate-pulse text-lg">Loading system data...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="p-10 w-full flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

export default Loader;
