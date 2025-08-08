import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import one from '../assets/one.png';
import seeDiagnosis from '../assets/seeDiagnosis.png';
import three from '../assets/three.png';

export default function FeatureCard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add CSS for animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null); // reset old prediction
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append('file', selectedImage);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPrediction(response.data); // { predicted_class, confidence, predicted_index }
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction({ error: 'Failed to diagnose image' });
    } finally {
      setLoading(false);
    }
  };

  const goToSegmemt = () => {
    navigate('/segment');
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
      {/* CARD ROW - Positioned to match original design */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center items-center bg-white rounded-xl shadow-2xl border border-gray-200 p-8 mx-8 max-w-4xl w-full">
          <div className="flex space-x-12 h-20">
            {/* Upload */}
            <div
              className="flex flex-row items-center text-center px-6 border-r border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleDivClick}
            >
              <img src={one} alt="Take a picture" className="w-20 h-20 mr-4" />
              <div className="text-left">
                <p className="font-semibold text-gray-800 mb-1">Scan a Part</p>
                <p className="text-sm text-gray-500">Upload a close-up!</p>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Diagnosis Card */}
            <div className="flex flex-row items-center text-center px-6 border-r border-gray-300"
            onClick={goToSegmemt}>
              <img src={seeDiagnosis} alt="See Diagnosis" className="w-16 h-16 mr-4" />
              <div className="text-left">
                <p className="font-semibold text-gray-800 mb-1">Full Plant Segmentation</p>
                <p className="text-sm text-gray-500">Get per-part diagnosis</p>
              </div>
            </div>

            {/* Medicine Card */}
            <div className="flex flex-row items-center text-center px-6">
              <img src={three} alt="Get Medicine" className="w-20 h-20 mr-4" />
              <div className="text-left">
                <p className="font-semibold text-gray-800 mb-1">Get Medicine</p>
                <p className="text-sm text-gray-500">Find Your Fix.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW + PREDICTION - Enhanced UI */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center">
                  <span className="mr-2">🔍</span>
                  AI Crop Analysis
                </h3>
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedImage(null);
                    setPrediction(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[calc(80vh-60px)] overflow-y-auto">
              {/* Image Preview */}
              <div className="mb-4">
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Crop Preview"
                    className="w-full max-w-xs mx-auto rounded-lg shadow-md border-2 border-gray-100 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center mb-4">
                <button
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${loading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  onClick={handlePredict}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center text-sm">
                      <span className="mr-2">🤖</span>
                      Start AI Diagnosis
                    </div>
                  )}
                </button>
              </div>

              {/* Results Section */}
              {prediction && !prediction.error && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 animate-fadeIn">
                  <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                    <span className="mr-2">✅</span>
                    Diagnosis Report
                  </h4>

                  <div className="space-y-4">
                    {/* Condition */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-2">🌿</span>
                        <span className="font-semibold text-gray-700 text-sm">Condition</span>
                      </div>
                      <p className="font-bold text-green-700">{prediction.predicted_class}</p>
                    </div>

                    {/* Confidence */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">🎯</span>
                        <span className="font-semibold text-gray-700 text-sm">Confidence</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${prediction.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-green-700 text-sm">
                          {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    {prediction.category && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2">📂</span>
                          <span className="font-semibold text-gray-700 text-sm">Category</span>
                        </div>
                        <p className="text-gray-800 font-medium">{prediction.category}</p>
                      </div>
                    )}

                    {/* Part Scanned */}
                    {prediction.part_scanned && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2">🧪</span>
                          <span className="font-semibold text-gray-700 text-sm">Part Scanned</span>
                        </div>
                        <p className="text-gray-800 font-medium">{prediction.part_scanned}</p>
                      </div>
                    )}

                    {/* Symptoms */}
                    {prediction.symptoms && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2">🩺</span>
                          <span className="font-semibold text-gray-700 text-sm">Symptoms</span>
                        </div>
                        <p className="text-gray-700">{prediction.symptoms}</p>
                      </div>
                    )}

                    {/* Treatment */}
                    {prediction.treatment?.length > 0 && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2">💊</span>
                          <span className="font-semibold text-gray-700 text-sm">Treatment</span>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                          {prediction.treatment.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention */}
                    {prediction.prevention?.length > 0 && (
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-2">🛡️</span>
                          <span className="font-semibold text-gray-700 text-sm">Prevention</span>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                          {prediction.prevention.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Error Display */}
              {prediction && prediction.error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-l-4 border-red-500 animate-fadeIn">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">❌</span>
                    <div>
                      <h4 className="font-bold text-red-800">Analysis Failed</h4>
                      <p className="text-red-600 text-sm mt-1">{prediction.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}