import React, { useState } from 'react';
import './Calculate_Decrease.css';
import { calculateAreaDecreasePercent } from './utils/Calculate_Decrease';
import { useNavigate } from 'react-router-dom';

const Calculate_Decrease = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    beforeLength: '',
    beforeWidth: '',
    afterLength: '',
    afterWidth: ''
  });
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const pct = calculateAreaDecreasePercent(
        parseFloat(formData.beforeLength),
        parseFloat(formData.beforeWidth),
        parseFloat(formData.afterLength),
        parseFloat(formData.afterWidth)
      );
      setResult(`Combined (area) decreased by ${pct.toFixed(2)}%`);
    } catch (error) {
      setResult(error.message);
    }
  };

  return (
    <div className="form-container">
      <button className="back-btn text-center mt-4 mb-4 border border-primary border-radius rounded" onClick={()=>navigate(-1)}>Back</button>
      <h2>Self Healing Parameters</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Parameters Before Self Healing</h3>
          <div className="form-group">
            <label htmlFor="beforeLength">Length (mm):</label>
            <input
              type="number"
              id="beforeLength"
              name="beforeLength"
              value={formData.beforeLength}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="beforeWidth">Width (mm):</label>
            <input
              type="number"
              id="beforeWidth"
              name="beforeWidth"
              value={formData.beforeWidth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Parameters After Self Healing</h3>
          <div className="form-group">
            <label htmlFor="afterLength">Length (mm):</label>
            <input
              type="number"
              id="afterLength"
              name="afterLength"
              value={formData.afterLength}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="afterWidth">Width (mm):</label>
            <input
              type="number"
              id="afterWidth"
              name="afterWidth"
              value={formData.afterWidth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
      {result && <p className="result text-center mt-4">{result}</p>}
    </div>
  );
};


export default Calculate_Decrease