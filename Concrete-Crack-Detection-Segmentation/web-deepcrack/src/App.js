import React from 'react';
import Crack_Detection_CNN from './components/CNN/Crack_Detection';
import {  Route, Routes } from 'react-router-dom';
import Calculate_Decrease from './Calculate_Decrease';
import HomePage from './components/HomePage';
import ConcreteCrackUpload from './components/ConcreteCrackUpload';
import SelectModel from './components/SelectModel';
import CrackDetectionYOLO from './components/Yolo/CrackDetectionYOLO';
import LandingPage from './components/LandingPage';
function App() {
  
  return ( 
  <Routes>
     <Route path="/" element={<LandingPage />} />
     <Route path="/compare-cnn" element={<Crack_Detection_CNN />} />
     <Route path='/store' element={<ConcreteCrackUpload />} />
     <Route path="/home" element={<HomePage />} />
     <Route path="select-model" element={<SelectModel />} />
     <Route path='/calculate-decrease' element={<Calculate_Decrease />} />
     <Route path='/compare-yolo' element={<CrackDetectionYOLO />} />
  </Routes>
);
}

export default App;
