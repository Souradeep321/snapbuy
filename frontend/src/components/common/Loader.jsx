import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white">
      <div className="w-16 h-16 border-4 border-t-4 border-t-[#0f172a] border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
