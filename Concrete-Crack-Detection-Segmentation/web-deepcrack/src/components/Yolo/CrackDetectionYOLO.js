import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleImagePredictionYOLO from './SingleImagePredictionYOLO';
import { calculateAreaDecreasePercent } from '../../utils/areaCalculation';

function CrackDetectionYOLO() {
  const navigate = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);

  useEffect(() => {
    if (beforeData && afterData) {
      const { Width: w1, Height: h1 } = beforeData.dimensions;
      const { Width: w2, Height: h2 } = afterData.dimensions;
      const pct = calculateAreaDecreasePercent(w1, h1, w2, h2);
      setPercentageChange(pct);
    }
  }, [beforeData, afterData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-lg">
          YOLO Crack Detection & Healing Analysis
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SingleImagePredictionYOLO
          title="Before Healing"
          endpoint="http://127.0.0.1:8000/yolo-predict"
          onPrediction={setBeforeData}
          supabaseFetch={true}
        />
        <SingleImagePredictionYOLO
          title="After Healing"
          endpoint="http://127.0.0.1:8000/yolo-predict"
          onPrediction={setAfterData}
          supabaseFetch={false}
        />
      </div>

      {percentageChange !== null && (
        <div className="mt-10 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-xl text-center">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">Healing Progress</h2>
            <p
              className={`text-3xl font-bold ${
                percentageChange > 0 ? 'text-emerald-400' : 'text-rose-500'
              }`}
            >
              Crack count {percentageChange > 0 ? 'decreased' : 'increased'} by {Math.abs(percentageChange).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      <div className="mt-16">
        <h2 className="text-3xl text-center font-bold text-indigo-300 mb-8">Prediction Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {beforeData && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold text-center text-purple-300 mb-3">Before Healing</h3>
              <img
                src={`data:image/jpeg;base64,${beforeData.image}`}
                alt="Before"
                className="w-full rounded-lg border border-white/20"
              />
              <p className="text-center mt-3 text-white/90">Detected cracks: {beforeData.predictions.length}</p>
            </div>
          )}
          {afterData && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold text-center text-purple-300 mb-3">After Healing</h3>
              <img
                src={`data:image/jpeg;base64,${afterData.image}`}
                alt="After"
                className="w-full rounded-lg border border-white/20"
              />
              <p className="text-center mt-3 text-white/90">Detected cracks: {afterData.predictions.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrackDetectionYOLO;
