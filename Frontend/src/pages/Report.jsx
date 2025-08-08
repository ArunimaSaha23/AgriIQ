import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import happyFarmer from '../assets/happyFarmer.png';
import reportPge from '../assets/reportPge.png';

const Report = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/report/${id}`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setEditedReport(data);
      })
      .catch(err => console.error("Failed to fetch report", err));
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:8000/report/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          predicted_class: editedReport.predicted_class,
          category: editedReport.category,
          part_scanned: editedReport.part_scanned,
          symptoms: editedReport.symptoms,
          treatment: editedReport.treatment,
          prevention: editedReport.prevention,
          farmer_notes: editedReport.farmer_notes || ''
        })
      });

      const result = await response.json();
      
      if (result.message === "Report updated successfully") {
        setReport(result.updated_report || editedReport);
        setIsEditing(false);
        alert('Report updated successfully!');
      } else {
        alert('Failed to update report: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedReport(report);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditedReport(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setEditedReport(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditedReport(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c7f0a8] via-[#7dc788] to-[#275d4f] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center text-emerald-900">
            <span className="text-6xl mb-4 block">🔍</span>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Report Not Found</h2>
            <p className="text-emerald-700">The requested crop diagnosis report could not be located.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f0a8] via-[#7dc788] to-[#275d4f] relative overflow-hidden text-emerald-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-lg">
            <img
              src={reportPge}
              alt="AgriIQ Icon"
              className="w-[60px] h-[60px] object-contain flex-shrink-0"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg text-emerald-900">
            Crop Diagnosis Report
          </h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-emerald-900 px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 mb-4 mx-auto font-semibold"
            >
              <span className="text-lg">✏️</span>
              Edit Report
            </button>
          ) : (
            <div className="flex gap-3 mb-4 justify-center">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm text-emerald-900 px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 font-semibold"
              >
                <span className="text-lg">💾</span>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm text-emerald-900 px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 font-semibold"
              >
                <span className="text-lg">❌</span>
                Cancel
              </button>
            </div>
          )}
          <div className="w-24 h-1 bg-emerald-200 mx-auto rounded-full"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Basic Information Card */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🗓️</span>
              </div>
              <h3 className="text-xl font-bold">Basic Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-white/10 rounded-lg">
                <span className="font-medium">Scan Date:</span>
                <span className="font-semibold">
                  {new Date(report.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/10 rounded-lg">
                <span className="font-medium">Uploaded by:</span>
                <span className="font-semibold">Bharat Jhawar</span>
              </div>
              {report.last_updated && (
                <div className="flex justify-between items-center py-2 px-3 bg-white/10 rounded-lg">
                  <span className="font-medium">Last Updated:</span>
                  <span className="font-semibold text-sm">
                    {new Date(report.last_updated).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Crop Details Card */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold">Crop Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-white/10 rounded-lg">
                <span className="font-medium">Crop Type:</span>
                <span className="font-semibold">Maize</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/10 rounded-lg">
                <span className="font-medium">Part Scanned:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedReport.part_scanned || ''}
                    onChange={(e) => handleInputChange('part_scanned', e.target.value)}
                    className="bg-white/20 text-emerald-900 px-2 py-1 rounded border border-white/30 font-semibold"
                  />
                ) : (
                  <span className="font-semibold">{report.part_scanned || 'Leaf'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Disease Detection Card */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 mb-8 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🦠</span>
            </div>
            <h3 className="text-xl font-bold">Disease Detection Result</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="py-3 px-4 bg-white/10 rounded-lg">
                <div className="text-sm font-medium mb-1">Detected Disease</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedReport.predicted_class || ''}
                    onChange={(e) => handleInputChange('predicted_class', e.target.value)}
                    className="bg-white/20 text-emerald-900 px-2 py-1 rounded border border-white/30 font-semibold text-lg w-full"
                  />
                ) : (
                  <div className="font-semibold text-lg">{report.predicted_class}</div>
                )}
              </div>
              <div className="py-3 px-4 bg-white/10 rounded-lg">
                <div className="text-sm font-medium mb-1">Confidence Level</div>
                <div className="font-semibold">{report.confidence}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="py-3 px-4 bg-white/10 rounded-lg">
                <div className="text-sm font-medium mb-1">Category</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedReport.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="bg-white/20 text-emerald-900 px-2 py-1 rounded border border-white/30 font-semibold w-full"
                  />
                ) : (
                  <div className="font-semibold">{report.category || 'N/A'}</div>
                )}
              </div>
              <div className="py-3 px-4 bg-white/10 rounded-lg">
                <div className="text-sm font-medium mb-1">Symptoms Observed</div>
                {isEditing ? (
                  <textarea
                    value={editedReport.symptoms || ''}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="bg-white/20 text-emerald-900 px-2 py-1 rounded border border-white/30 font-semibold text-sm w-full h-20 resize-none"
                  />
                ) : (
                  <div className="font-semibold text-sm">{report.symptoms || 'N/A'}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions Card */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">💊</span>
            </div>
            <h3 className="text-xl font-bold">Recommended Actions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Treatment */}
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-sm">🎯</span> Treatment
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('treatment')}
                    className="bg-green-400 hover:bg-green-500 text-white text-xs px-2 py-1 rounded ml-auto"
                  >
                    + Add
                  </button>
                )}
              </h4>
              <div className="space-y-2">
                {(editedReport.treatment || []).map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-xs mt-1">•</span>
                    {isEditing ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleArrayChange('treatment', index, e.target.value)}
                          className="bg-white/20 text-emerald-900 px-2 py-1 rounded border border-white/30 text-sm flex-1"
                        />
                        <button
                          onClick={() => removeArrayItem('treatment', index)}
                          className="bg-red-400 hover:bg-red-500 text-white text-xs px-2 py-1 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm">{step}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention */}
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-sm">🛡️</span> Prevention
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('prevention')}
                    className="bg-green-400 hover:bg-green-500 text-white text-xs px-2 py-1 rounded ml-auto"
                  >
                    + Add
                  </button>
                )}
              </h4>
              <div className="space-y-2">
                {(editedReport.prevention || []).map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-xs mt-1">•</span>
                    {isEditing ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleArrayChange('prevention', index, e.target.value)}
                          className="bg-white/20 text-emerald-900 px-2 py-1 rounded border border-white/30 text-sm flex-1"
                        />
                        <button
                          onClick={() => removeArrayItem('prevention', index)}
                          className="bg-red-400 hover:bg-red-500 text-white text-xs px-2 py-1 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm">{step}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Notes Section (Only shown when editing or if notes exist) */}
        {(isEditing || report.farmer_notes) && (
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-xl font-bold">Farmer Notes</h3>
            </div>
            {isEditing ? (
              <textarea
                value={editedReport.farmer_notes || ''}
                onChange={(e) => handleInputChange('farmer_notes', e.target.value)}
                placeholder="Add your own observations or notes here..."
                className="bg-white/20 text-emerald-900 px-4 py-3 rounded-lg border border-white/30 w-full h-24 resize-none"
              />
            ) : (
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm">{report.farmer_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Happy Farmer Image */}
        <div className="text-center mt-12">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
            <img
              src={happyFarmer}
              alt="Happy Farmer"
              className="w-24 h-24 mx-auto rounded-full border-4 border-white/30 shadow-lg"
            />
            <p className="text-emerald-800 text-sm mt-2 font-medium">
              {isEditing ? 'Edit Mode Active' : 'Report Generated Successfully'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;


