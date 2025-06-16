import React, { useState } from 'react'
import ConcreteCrackUpload from './ConcreteCrackUpload'
import CrackDetectionCNN from './CNN/CrackDetectionCNN'
import CrackDetectionYOLO from './Yolo/CrackDetectionYOLO'

const Store = () => {
  const [activeTab, setActiveTab] = useState('upload')
  const [analysisMethod, setAnalysisMethod] = useState('cnn')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-6 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
          🧠 Concrete Crack Analysis
        </h1>

        {/* Tab Navigation */}
        <div className="flex mb-10 bg-white/5 backdrop-blur-md rounded-xl p-1 shadow-md shadow-white/10">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            📷 Upload Images
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
              activeTab === 'analyze'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            🧪 Analyze Results
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-10">
          {activeTab === 'upload' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
                Upload Concrete Images
              </h2>
              <ConcreteCrackUpload />
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="space-y-10">
              {/* Analysis Method Selection */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 border border-white/10">
                <h2 className="text-2xl font-semibold mb-6 text-purple-300">
                  Choose Analysis Method
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setAnalysisMethod('cnn')}
                    className={`flex-1 py-3 rounded-lg text-white transition-all duration-300 ${
                      analysisMethod === 'cnn'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-600 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    CNN Model
                  </button>
                  <button
                    onClick={() => setAnalysisMethod('yolo')}
                    className={`flex-1 py-3 rounded-lg text-white transition-all duration-300 ${
                      analysisMethod === 'yolo'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-md shadow-pink-500/30'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    YOLO Model
                  </button>
                </div>
              </div>

              {/* Analysis Results */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 border border-white/10">
                {analysisMethod === 'cnn' ? (
                  <>
                    <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
                      CNN Analysis Results
                    </h2>
                    <CrackDetectionCNN />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold mb-6 text-purple-300">
                      YOLO Analysis Results
                    </h2>
                    <CrackDetectionYOLO />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Store
