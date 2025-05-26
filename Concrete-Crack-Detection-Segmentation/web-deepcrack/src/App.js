import React from 'react';
import Crack_Detection from './Crack_Detection';
import {  Route, Routes } from 'react-router-dom';
import Calculate_Decrease from './Calculate_Decrease';

function App() {
  
  return ( 
  <Routes>
     <Route path="/" element={<Crack_Detection />} />
     <Route path='/calculate-decrease' element={<Calculate_Decrease />} />
  </Routes>
);
}

export default App;
