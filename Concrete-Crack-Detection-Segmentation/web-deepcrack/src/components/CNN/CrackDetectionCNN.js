import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleImagePrediction from './SingleImagePrediction';
import { calculateAreaDecreasePercent } from '../../utils/Calculate_Decrease_CNN';

function CrackDetectionCNN() {  
  const navigate = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const storeBeforeImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem('beforeHealingImage', e.target.result);
      setBeforePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const storeAfterImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAfterPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePrediction = async (formData, dimensions, isBefore) => {
    try {
      setIsPredicting(true);
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

      const newData = {
        dimensions,
        prediction: `data:image/png;base64,${data.result_image}`,
        fused: `data:image/png;base64,${data.visuals.fused}`,
        sides: Object.keys(data.visuals)
                .filter(k => k.startsWith('side'))
                .map(k => `data:image/png;base64,${data.visuals[k]}`),
        metrics: data.metrics,
      };

      if (isBefore) {
        setBeforeData(newData);
        storeBeforeImage(file);
      } else {
        setAfterData(newData);
        storeAfterImage(file);
      }

    } catch (err) {
      console.error('Prediction Error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    if (beforeData && afterData) {
      const pct = calculateAreaDecreasePercent(beforeData.metrics, afterData.metrics);
      setPercentageChange(pct);
    }
  }, [beforeData, afterData]);

  const renderMetrics = (metrics, titleColor) => {
    if (!metrics) return null;
    
    return (
      <div className={`mt-4 p-4 rounded-lg bg-black/20 border ${titleColor === 'text-cyan-400' ? 'border-cyan-400/30' : 'border-pink-400/30'}`}>
        <h3 className={`text-lg font-semibold mb-2 ${titleColor}`}>Crack Metrics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-slate-300">Total Crack Area:</p>
            <p className="font-mono">{metrics.length_mm.toFixed(2)*metrics.width_mm.toFixed(2)} mm²</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Crack Length:</p>
            <p className="font-mono">{metrics.length_mm.toFixed(2)} mm</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Crack Width:</p>
            <p className="font-mono">{metrics.width_mm.toFixed(2)} mm</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Crack Angle:</p>
            <p className="font-mono">{metrics.angle_deg.toFixed(2)} deg</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Crack Percentage:</p>
            <p className="font-mono">{metrics.crack_percentage.toFixed(2)} %</p>
          </div>
        </div>
      </div>
    );
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
            onPrediction={(fd, dim) => handlePrediction(fd, dim, true)}
            onDimensionsChange={(dim) => setBeforeData(prev => ({ ...prev, dimensions: dim }))}
            onFileSelect={storeBeforeImage}
            fetchFromSupabase={true}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md">
          <SingleImagePrediction
            title="After Healing"
            onPrediction={(fd, dim) => handlePrediction(fd, dim, false)}
            onDimensionsChange={(dim) => setAfterData(prev => ({ ...prev, dimensions: dim }))}
            onFileSelect={storeAfterImage}
          />
        </div>
      </div>

      {/* Preview Section - Shows before prediction */}
      {(beforePreview || afterPreview) && !beforeData && !afterData && (
        <div className="text-center bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">Image Previews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beforePreview && (
              <div>
                <h3 className="text-lg font-medium text-cyan-400 mb-2">Before Healing Preview</h3>
                <img 
                  src={beforePreview} 
                  alt="Before Healing Preview" 
                  className="w-full h-64 object-contain rounded-md bg-black/20"
                />
                <p className="text-sm text-slate-300 mt-2">Uploaded image (not yet analyzed)</p>
              </div>
            )}
            {afterPreview && (
              <div>
                <h3 className="text-lg font-medium text-pink-400 mb-2">After Healing Preview</h3>
                <img 
                  src={afterPreview} 
                  alt="After Healing Preview" 
                  className="w-full h-64 object-contain rounded-md bg-black/20"
                />
                <p className="text-sm text-slate-300 mt-2">Uploaded image (not yet analyzed)</p>
              </div>
            )}
          </div>
          {isPredicting && (
            <div className="mt-4 text-cyan-300">
              <p>Processing images... Please wait</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mt-2"></div>
            </div>
          )}
        </div>
      )}

      {/* Healing Result Card */}
      {(percentageChange !== null && beforeData && afterData )&& (
        <div className="text-center bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-cyan-300">Healing Progress</h2>
          <p className={`text-3xl mt-2 font-bold ${percentageChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            Crack area {percentageChange >=0 ? 'decreased' : 'increased'} by {Math.abs(percentageChange).toFixed(2)}%
          </p>
          <div className="mt-4 text-left">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Detailed Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-300">Before Area:</p>
                <p className="font-mono">{beforeData?.metrics?.length_mm.toFixed(2)*beforeData?.metrics?.width_mm.toFixed(2)} mm²</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">After Area:</p>
                <p className="font-mono">{afterData?.metrics?.length_mm.toFixed(2)*afterData?.metrics?.width_mm.toFixed(2)} mm²</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Before Max Width:</p>
                <p className="font-mono">{beforeData?.metrics?.width_mm.toFixed(2)} mm</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">After Max Width:</p>
                <p className="font-mono">{afterData?.metrics?.width_mm.toFixed(2)} mm</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Before Crack percentage:</p>
                <p className="font-mono">{beforeData?.metrics?.crack_percentage.toFixed(2)} %</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">After Crack percentage:</p>
                <p className="font-mono">{afterData?.metrics?.crack_percentage.toFixed(2)} %</p>
              </div>
            </div>
          </div>
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
              <div className="mb-4">
                <h4 className="text-md text-cyan-300 mb-1">Original Image</h4>
                <img src={beforePreview} alt="Before Original" className="w-full rounded-md max-h-64 object-contain" />
              </div>
              <img src={beforeData.prediction} alt="Before Prediction" className="w-full rounded-md" />
              <p className="text-center mt-2 text-slate-300">Prediction Visualization</p>
              <img src={beforeData.fused} alt="Before Fused" className="w-full rounded-md mt-4" />
              <p className="text-center mt-2 text-slate-300">Fused Prediction</p>
              {renderMetrics(beforeData.metrics, 'text-cyan-400')}
            </div>

            {/* After Healing */}
            {afterData && (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-md">
                <h3 className="text-lg text-center text-pink-400 font-semibold mb-2">After Healing</h3>
                <div className="mb-4">
                  <h4 className="text-md text-pink-300 mb-1">Original Image</h4>
                  <img src={afterPreview} alt="After Original" className="w-full rounded-md max-h-64 object-contain" />
                </div>
                <img src={afterData.prediction} alt="After Prediction" className="w-full rounded-md" />
                <p className="text-center mt-2 text-slate-300">Prediction Visualization</p>
                <img src={afterData.fused} alt="After Fused" className="w-full rounded-md mt-4" />
                <p className="text-center mt-2 text-slate-300">Fused Prediction</p>
                {renderMetrics(afterData.metrics, 'text-pink-400')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CrackDetectionCNN;