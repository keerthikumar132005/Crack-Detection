import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleImagePrediction from './SingleImagePrediction';
import { calculateAreaDecreasePercent } from '../../utils/areaCalculation';

function CrackDetectionCNN() {  
  const navigate = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);

  const storeBeforeImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem('beforeHealingImage', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBeforePrediction = async (formData, dimensions) => {
    try {
      const file = formData.get("file");
      if (!file) throw new Error('No file found in form data');

      const response = await fetch(
        `http://127.0.0.1:8000/predict/${dimensions.Width}-${dimensions.Height}/${dimensions.unit}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setBeforeData({
        dimensions,
        prediction: `data:image/png;base64,${data[0]}`,
        fused: `data:image/png;base64,${data[1]}`,
        sides: data.slice(2, 7).map(side => `data:image/png;base64,${side}`),
      });
      calculatePercentageChange();
    } catch (err) {
      console.error('Error in handleBeforePrediction:', err);
    }
  };

  const handleAfterPrediction = async (formData, dimensions) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/predict/${dimensions.Width}-${dimensions.Height}/${dimensions.unit}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setAfterData({
        dimensions,
        prediction: `data:image/png;base64,${data[0]}`,
        fused: `data:image/png;base64,${data[1]}`,
        sides: data.slice(2, 7).map(side => `data:image/png;base64,${side}`),
      });
      calculatePercentageChange();
    } catch (err) {
      console.error(err);
    }
  };

  const calculatePercentageChange = () => {
    if (beforeData && afterData) {
      try {
        const { Width: w1, Height: h1 } = beforeData.dimensions;
        const { Width: w2, Height: h2 } = afterData.dimensions;
        const pct = calculateAreaDecreasePercent(w1, h1, w2, h2);
        setPercentageChange(pct);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        Crack Healing Progress Analysis Using CNN
      </h1>

      {/* Input Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md">
          <SingleImagePrediction
            title="Before Healing"
            onPrediction={handleBeforePrediction}
            onDimensionsChange={(dim) => setBeforeData(prev => ({ ...prev, dimensions: dim }))}
            onFileSelect={storeBeforeImage}
            fetchFromSupabase={true}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md">
          <SingleImagePrediction
            title="After Healing"
            onPrediction={handleAfterPrediction}
            onDimensionsChange={(dim) => setAfterData(prev => ({ ...prev, dimensions: dim }))}
          />
        </div>
      </div>

      {/* Healing Result Card */}
      {percentageChange !== null && (
        <div className="text-center bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-cyan-300">Healing Progress</h2>
          <p className={`text-3xl mt-2 font-bold ${percentageChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            Crack area {percentageChange > 0 ? 'decreased' : 'increased'} by {Math.abs(percentageChange).toFixed(2)}%
          </p>
        </div>
      )}

      {/* Prediction Results */}
      {beforeData && (
        <div>
          <h2 className="text-2xl font-semibold text-center text-purple-300 mb-6">Prediction Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Healing */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-md">
              <h3 className="text-lg text-center text-cyan-400 font-semibold mb-2">Before Healing</h3>
              <img src={beforeData.prediction} alt="Before Prediction" className="w-full rounded-md" />
              <p className="text-center mt-2 text-slate-300">Prediction Visualization</p>
              <img src={beforeData.fused} alt="Before Fused" className="w-full rounded-md mt-4" />
              <p className="text-center mt-2 text-slate-300">Fused Prediction</p>
            </div>

            {/* After Healing */}
            {afterData && (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-md">
                <h3 className="text-lg text-center text-pink-400 font-semibold mb-2">After Healing</h3>
                <img src={afterData.prediction} alt="After Prediction" className="w-full rounded-md" />
                <p className="text-center mt-2 text-slate-300">Prediction Visualization</p>
                <img src={afterData.fused} alt="After Fused" className="w-full rounded-md mt-4" />
                <p className="text-center mt-2 text-slate-300">Fused Prediction</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CrackDetectionCNN;
