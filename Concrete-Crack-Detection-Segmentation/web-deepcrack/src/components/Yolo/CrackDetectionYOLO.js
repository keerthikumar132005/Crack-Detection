import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleImagePredictionYOLO from './SingleImagePredictionYOLO';
import calculateCrackReductionSummary from '../../utils/Calculate_Decrease_Yolo';


const api_url = process.env.REACT_APP_API_URL;

function CrackDetectionYOLO() {
  const navigate = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (beforeData && afterData) {
      const res=calculateCrackReductionSummary(beforeData, afterData).summary;
      setResult(()=>res);
    }
  }, [afterData,beforeData]);
  const renderMetrics = (data, title) => {
    if (!data || !data.image_width_mm || !data.image_height_mm || !data.crack_percentage || 
        !data.total_crack_area_mm2 || !data.predictions) return null;
    
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-4 mt-4">
        <h3 className="text-xl font-semibold text-center text-cyan-300 mb-3">{title} Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-white/70">Image Dimensions</p>
            <p className="text-lg font-medium">
              {data.image_width_mm?.toFixed(1) || 'N/A'} mm × {data.image_height_mm?.toFixed(1) || 'N/A'} mm
            </p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-white/70">Crack Percentage</p>
            <p className="text-lg font-medium">{data.crack_percentage?.toFixed(2) || 'N/A'}%</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-white/70">Total Crack Area</p>
            <p className="text-lg font-medium">{data.total_crack_area_mm2?.toFixed(2) || 'N/A'} mm²</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-white/70">Detected Cracks</p>
            <p className="text-lg font-medium">{data.predictions?.length || 0}</p>
          </div>
        </div>
        
        {data.predictions?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-center text-purple-300 mb-2">Individual Crack Details</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white/90">
                <thead className="text-xs text-white/70 uppercase bg-white/5">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Confidence</th>
                    <th className="px-4 py-2">Dimensions (mm)</th>
                    <th className="px-4 py-2">Area (mm²)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.predictions.map((crack, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{crack.confidence ? (crack.confidence * 100).toFixed(1) + '%' : 'N/A'}</td>
                      <td className="px-4 py-2">
                        {crack.bounding_box_mm?.width ? crack.bounding_box_mm.width.toFixed(1) : 'N/A'} × 
                        {crack.bounding_box_mm?.height ? crack.bounding_box_mm.height.toFixed(1) : 'N/A'}
                      </td>
                      <td className="px-4 py-2">{crack.area_mm2 ? crack.area_mm2.toFixed(2) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

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
          endpoint={`${api_url}/yolo-predict`}
          onPrediction={setBeforeData}
          supabaseFetch={true}
        />
        <SingleImagePredictionYOLO
          title="After Healing"
          endpoint={`${api_url}/yolo-predict`}
          onPrediction={setAfterData}
          supabaseFetch={false}
        />
      </div>

      {result !== null && (
        <div className="mt-10 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-xl text-center">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">Healing Progress</h2>
            <p
              className={`text-3xl font-bold text-emerald-400`}
            >
              {result}
            </p>
          </div>
        </div>
      )}

      <div className="mt-16">
        <h2 className="text-3xl text-center font-bold text-indigo-300 mb-8">Prediction Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {beforeData && beforeData.image && (
            <div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold text-center text-purple-300 mb-3">Before Healing</h3>
                <img
                  src={`data:image/jpeg;base64,${beforeData.image}`}
                  alt="Before"
                  className="w-full rounded-lg border border-white/20"
                />
                <p className="text-center mt-3 text-white/90">
                  Detected cracks: {beforeData.predictions?.length || 0}
                </p>
              </div>
              {renderMetrics(beforeData, "Before Healing")}
            </div>
          )}
          {afterData && afterData.image && (
            <div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold text-center text-purple-300 mb-3">After Healing</h3>
                <img
                  src={`data:image/jpeg;base64,${afterData.image}`}
                  alt="After"
                  className="w-full rounded-lg border border-white/20"
                />
                <p className="text-center mt-3 text-white/90">
                  Detected cracks: {afterData.predictions?.length || 0}
                </p>
              </div>
              {renderMetrics(afterData, "After Healing")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrackDetectionYOLO;