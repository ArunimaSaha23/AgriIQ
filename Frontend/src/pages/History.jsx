import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import grassTwo from '../assets/grassTwo.png';

const CropHealthHistory = () => {
  const [cropReports, setCropReports] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched reports:", data);
        setCropReports(data);
      })
      .catch(err => console.error("Failed to fetch history", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/report/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.deleted) {
        setCropReports(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Failed to delete report.");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ Improved helper function to get image URL
  const getImageUrl = (report) => {
    // Check if this image has already failed to load
    if (imageErrors.has(report._id)) {
      return grassTwo;
    }

    // Try to use the new image_filename field first
    if (report.image_filename) {
      const url = `http://localhost:8000/image/${report.image_filename}`;
      console.log(`Using image_filename: ${report.image_filename} -> ${url}`);
      return url;
    }
    
    // Fallback to extracting filename from image_path
    if (report.image_path) {
      const filename = report.image_path.split('/').pop() || report.image_path.split('\\').pop();
      if (filename) {
        const url = `http://localhost:8000/image/${filename}`;
        console.log(`Using image_path: ${report.image_path} -> ${url}`);
        return url;
      }
    }
    
    // Final fallback to default image
    console.log(`No valid image found for report ${report._id}, using fallback`);
    return grassTwo;
  };

  // ✅ Enhanced image error handler
  const handleImageError = (e, reportId) => {
    console.warn(`Failed to load uploaded image for report ${reportId}, using fallback`);
    
    // Mark this image as failed to prevent retry loops
    setImageErrors(prev => new Set([...prev, reportId]));
    
    // Set fallback image
    e.target.src = grassTwo;
  };

  // ✅ Test image connectivity function
  const testImageConnectivity = async () => {
    try {
      const response = await fetch('http://localhost:8000/debug/images');
      const data = await response.json();
      console.log('Available images:', data);
    } catch (err) {
      console.error('Failed to fetch debug info:', err);
    }
  };

  // ✅ Call test function on component mount (for debugging)
  useEffect(() => {
    testImageConnectivity();
  }, []);

  const displayedReports = showAll ? cropReports : cropReports.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f0a8] via-[#7dc788] to-[#275d4f] px-4 pt-24 pb-8">
      <h1 className="text-4xl font-bold text-emerald-900 text-center mb-12 drop-shadow-lg">
        📊 Crop Health History
      </h1>

      {displayedReports.length === 0 ? (
        <div className="text-center text-emerald-900 text-xl">
          No crop health reports found.
        </div>
      ) : (
        displayedReports.map((report) => (
          <div key={report._id} className="bg-white/20 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-xl border border-white/30 hover:bg-white/25 transition-all duration-300 max-w-6xl mx-auto">
            <div className="flex items-start gap-6">
              {/* ✅ Enhanced image section */}
              <div className="relative w-32 h-24 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={getImageUrl(report)}
                  alt={`${report.predicted_class} leaf`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => handleImageError(e, report._id)}
                  onLoad={() => {
                    console.log(`✅ Image loaded successfully for report ${report._id}`);
                  }}
                />
                
                {/* ✅ Image status indicator
                <div className="absolute top-1 right-1">
                  {imageErrors.has(report._id) ? (
                    <div className="w-3 h-3 bg-red-500 rounded-full" title="Using fallback image"></div>
                  ) : (
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Original image loaded"></div>
                  )}
                </div> */}
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Maize</h3>
                <p className="text-emerald-900 mb-2">
                  <strong>Issue:</strong> {report.predicted_class}
                </p>
                <p className="text-emerald-900 mb-2">
                  <strong>Confidence:</strong> {report.confidence}
                </p>
                <p className="text-emerald-900 mb-2">
                  <strong>Action:</strong> {report.treatment && report.treatment[0] ? report.treatment[0] : 'N/A'}
                </p>
                <p className="text-emerald-800 text-sm">
                  <strong>Date:</strong> {new Date(report.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
                
                {/* ✅ Show original filename */}
                {report.original_filename && (
                  <p className="text-emerald-800 text-xs mt-1">
                    <strong>Original File:</strong> {report.original_filename}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 flex-shrink-0">
                <button
                  onClick={() => navigate(`/report/${report._id}`)}
                  className="bg-white hover:bg-white text-green-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Report
                </button>
                <button
                  onClick={() => handleDelete(report._id)}
                  className="border-2 border-white/70 text-white hover:bg-white/10 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {cropReports.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white hover:bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CropHealthHistory;