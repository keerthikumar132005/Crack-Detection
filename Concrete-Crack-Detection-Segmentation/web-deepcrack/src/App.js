import React from 'react';
import Crack_Detection from './components/Crack_Detection';
import {  Route, Routes } from 'react-router-dom';
import Calculate_Decrease from './Calculate_Decrease';
import HomePage from './components/HomePage';
import ConcreteCrackUpload from './components/ConcreteCrackUpload';

function App() {
  
  return ( 
  <Routes>
     <Route path="/compare" element={<Crack_Detection />} />
     <Route path='/store' element={<ConcreteCrackUpload />} />
     <Route path="/" element={<HomePage />} />
     <Route path='/calculate-decrease' element={<Calculate_Decrease />} />
  </Routes>
);
}

export default App;
