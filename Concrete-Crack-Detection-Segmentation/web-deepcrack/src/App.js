import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import Store from './components/Store';
import SelectModel from './components/SelectModel';
import CrackDetectionCNN from './components/CNN/CrackDetectionCNN';
import CrackDetectionYOLO from './components/Yolo/CrackDetectionYOLO';

function App() {
  return (
    <div className="pt-[60px] min-h-screen bg-gray-50"> {/* Top padding for navbar */}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/store" element={<Store />} />
          <Route path="/select-model" element={<SelectModel />} />
          <Route path="/compare-cnn" element={<CrackDetectionCNN />} />
          <Route path="/compare-yolo" element={<CrackDetectionYOLO />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
