import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-100 overflow-hidden">
        <div className="h-full bg-indigo-600 animate-progress origin-left"></div>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
        <p className="text-indigo-700 font-semibold degular-semibold tracking-widest uppercase text-xs animate-pulse">
          Loading
        </p>
      </div>
    </div>
  );
};

export default Loader;
