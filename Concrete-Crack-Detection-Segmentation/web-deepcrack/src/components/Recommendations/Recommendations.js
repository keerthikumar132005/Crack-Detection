import React from 'react';
import CombinedCrackDetection from '../Combined/CombinedCrackDetection'; // Make sure the path is correct
import { FaLightbulb } from 'react-icons/fa';

const Recommendations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-6 text-white font-sans">
      <div className=" mx-auto">
        <div className="flex items-center mb-10 text-center">
          <FaLightbulb size={40} className="mr-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full p-2"/>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
            Recommendations
          </h1>
        </div>

        {/* Combined Analysis Results */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 border border-white/10">
          <CombinedCrackDetection />
        </div>
      </div>
    </div>
  );
};

export default Recommendations;