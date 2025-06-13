import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Concrete Crack Analysis</h1>
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          onClick={() => navigate('/store')}
        >
          Store Crack Images
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
          onClick={() => navigate('/select-model')}
        >
          Select Model
        </button>
      </div>
    </div>
  );
}

export default HomePage;