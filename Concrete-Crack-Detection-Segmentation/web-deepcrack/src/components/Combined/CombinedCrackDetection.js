import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CombinedSingleImagePrediction from './CombinedSingleImagePrediction';

const api_key = process.env.REACT_APP_API_KEY;
const api_url = process.env.REACT_APP_API_URL;

function CombinedCrackDetection() {  
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState({ cnn: null, yolo: null });
  const [loading,setLoading]=useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [recommendations, setRecommendations] = useState({
    cnn: null,
    yolo: null,
    loading: false,
    error: null
  });
  const [location, setLocation] = useState({
    latitude: '',
    longitude: ''
  });

  const storeImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchRecommendations = async (crackWidth, modelType) => {
    if (!location.latitude || !location.longitude) return;
    
    try {
      setRecommendations(prev => ({
        ...prev,
        loading: true,
        error: null,
        [modelType]: null
      }));
      const response = await fetch(`${api_url}/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api_key}`
        },
        body: JSON.stringify({
          crack_width: crackWidth,
          latitude: location.latitude,
          longitude: location.longitude
        })
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(prev => ({
        ...prev,
        [modelType]: data,
        loading: false
      }));
    } catch (err) {
      setRecommendations(prev => ({
        ...prev,
        error: err.message,
        loading: false
      }));
    }
  };

  const handlePrediction = async (formData, dimensions) => {
    try {
      setIsPredicting(true);
      setLoading(true)
      const file = formData.get("file");
      if (!file) throw new Error('No file found in form data');

      // Store location if available in dimensions
      if (dimensions.latitude && dimensions.longitude) {
        setLocation({
          latitude: dimensions.latitude,
          longitude: dimensions.longitude
        });
      }

      // CNN Prediction
      const cnnResponse = await fetch(
        `${api_url}/predict/${dimensions.Width}-${dimensions.Height}/${dimensions.unit}`,
        {
          headers: { 'Authorization': `Bearer ${api_key}` },
          method: 'POST',
          body: formData,
        }
      );
      const cnnData = await cnnResponse.json();

      // YOLO Prediction
      const yoloResponse = await fetch(
        `${api_url}/yolo-predict`,
        {
          headers: { 'Authorization': `Bearer ${api_key}` },
          method: 'POST',
          body: formData,
        }
      );
      const yoloData = await yoloResponse.json();

      const newData = {
        dimensions,
        cnn: {
          prediction: `data:image/png;base64,${cnnData.result_image}`,
          fused: `data:image/png;base64,${cnnData.visuals.fused}`,
          sides: Object.keys(cnnData.visuals)
                  .filter(k => k.startsWith('side'))
                  .map(k => `data:image/png;base64,${cnnData.visuals[k]}`),
          metrics: cnnData.metrics,
        },
        yolo: yoloData
      };

      setPredictionData(newData);
      storeImage(file);

      // Fetch recommendations for both models
      if (cnnData.metrics?.width_mm) {
        fetchRecommendations(cnnData.metrics.width_mm, 'cnn');
      }
      
      if (yoloData.predictions?.[0]?.bounding_box_mm?.width) {
        // Get average width for YOLO predictions
        const avgWidth = yoloData.predictions.reduce((sum, pred) => 
          sum + pred.bounding_box_mm.width, 0) / yoloData.predictions.length;
        fetchRecommendations(avgWidth, 'yolo');
      }
      setLoading(false)

    } catch (err) {
      console.error('Prediction Error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const renderRecommendations = (modelData, modelType) => {
    if (!recommendations[modelType]) return null;

    const rec = recommendations[modelType];
    
    return (
      <div className={`mt-6 p-4 rounded-lg bg-black/20 border ${modelType === 'cnn' ? 'border-cyan-400/30' : 'border-pink-400/30'}`}>
        <h3 className="text-lg font-semibold mb-3 text-center">
          {modelType === 'cnn' ? 'CNN' : 'YOLO'} Repair Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-300 mb-1">Crack Width</h4>
            <p className="font-mono text-cyan-300">{rec.crack_width_mm?.toFixed(2)} mm</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-300 mb-1">Temperature</h4>
            <p className="font-mono text-cyan-300">{rec.weather?.temperature_C?.toFixed(1)} °C</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-300 mb-1">Humidity</h4>
            <p className="font-mono text-cyan-300">
              {rec.weather?.['humidity_%']?.toFixed(1)} %
            </p>
          </div>
        </div>

        {rec.recommended_methods?.length > 0 ? (
          <div className="space-y-3">
            {rec.recommended_methods.map((method, index) => (
              <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-300 mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-cyan-200">{method}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-4">No recommendations available</p>
        )}
      </div>
    );
  };

  const renderMetrics = (data) => {
    if (!data) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CNN Metrics */}
        <div className="mt-4 p-4 rounded-lg bg-black/20 border border-cyan-400/30">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">CNN Crack Metrics</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-slate-300">Total Crack Area:</p>
              <p className="font-mono">{data.cnn.metrics.length_mm.toFixed(2)*data.cnn.metrics.width_mm.toFixed(2)} mm²</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Crack Length:</p>
              <p className="font-mono">{data.cnn.metrics.length_mm.toFixed(2)} mm</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Crack Width:</p>
              <p className="font-mono">{data.cnn.metrics.width_mm.toFixed(2)} mm</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Crack Angle:</p>
              <p className="font-mono">{data.cnn.metrics.angle_deg.toFixed(2)} deg</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Crack Percentage:</p>
              <p className="font-mono">{data.cnn.metrics.crack_percentage.toFixed(2)} %</p>
            </div>
          </div>
          
          {renderRecommendations(data, 'cnn')}
        </div>
        
        {/* YOLO Metrics */}
        <div className="mt-4 p-4 rounded-lg bg-black/20 border border-pink-400/30">
          <h3 className="text-lg font-semibold mb-2 text-pink-400">YOLO Crack Metrics</h3>
          
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-300">Image Dimensions:</p>
              <p className="font-mono">{data.yolo.image_width_mm?.toFixed(1)} mm × {data.yolo.image_height_mm?.toFixed(1)} mm</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Crack Percentage:</p>
              <p className="font-mono">{data.yolo.crack_percentage?.toFixed(2)} %</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Total Crack Area:</p>
              <p className="font-mono">{data.yolo.total_crack_area_mm2?.toFixed(2)} mm²</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Detected Cracks:</p>
              <p className="font-mono">{data.yolo.predictions?.length || 0}</p>
            </div>
          </div>

          {/* Detailed Crack Predictions */}
          {data.yolo.predictions?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-pink-300 mb-2">Individual Crack Details</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {data.yolo.predictions.map((pred, index) => (
                  <div key={index} className="p-3 bg-black/30 rounded-lg border border-pink-400/20">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-slate-300">Confidence:</p>
                        <p className="font-mono text-sm">{pred.confidence}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300">Area:</p>
                        <p className="font-mono text-sm">{pred.area_mm2?.toFixed(2)} mm²</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300">Bounding Box (mm):</p>
                        <p className="font-mono text-sm">{pred.bounding_box_mm.width.toFixed(1)} × {pred.bounding_box_mm.height.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300">Position (px):</p>
                        <p className="font-mono text-sm">
                          [{pred.bounding_box_px.x_min}, {pred.bounding_box_px.y_min}] - [{pred.bounding_box_px.x_max}, {pred.bounding_box_px.y_max}]
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {renderRecommendations(data, 'yolo')}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        Combined Crack Analysis (CNN + YOLO)
      </h1>

      {/* Input Component */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md">
          <CombinedSingleImagePrediction
            onPrediction={handlePrediction}
            onDimensionsChange={(dim) => setPredictionData(prev => ({ ...prev, dimensions: dim }))}
            onFileSelect={storeImage}
            fetchFromSupabase={true}
            setLocation={setLocation}
            loading={loading}
          />
        </div>
      </div>

      {/* Preview Section */}
      {imagePreview && !predictionData.cnn && (
        <div className="text-center bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-md max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">Image Preview</h2>
          <div>
            <img 
              src={imagePreview} 
              alt="Crack Preview" 
              className="w-full h-64 object-contain rounded-md bg-black/20 mx-auto"
            />
            <p className="text-sm text-slate-300 mt-2">Uploaded image (not yet analyzed)</p>
          </div>
          {isPredicting && (
            <div className="mt-4 text-cyan-300">
              <p>Processing image... Please wait</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mt-2"></div>
            </div>
          )}
        </div>
      )}

      {/* Prediction Results */}
      {predictionData.cnn && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-purple-300 mb-6">Prediction Results</h2>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-md">
            <div className="mb-4">
              <h4 className="text-md text-cyan-300 mb-1">Original Image</h4>
              <img src={imagePreview} alt="Original" className="w-full rounded-md max-h-64 object-contain mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <img src={predictionData.cnn.prediction} alt="CNN Prediction" className="w-full rounded-md" />
                <p className="text-center mt-2 text-slate-300">CNN Visualization</p>
              </div>
              <div>
                <img src={`data:image/jpeg;base64,${predictionData.yolo.image}`} alt="YOLO Prediction" className="w-full rounded-md" />
                <p className="text-center mt-2 text-slate-300">YOLO Visualization</p>
              </div>
            </div>
            
            {renderMetrics(predictionData)}
          </div>
        </div>
      )}
    </div>
  );
}

export default CombinedCrackDetection;