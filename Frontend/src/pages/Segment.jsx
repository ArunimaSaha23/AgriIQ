import React, { useState, useRef } from 'react';
import { Upload, RotateCcw, Zap, Eye, Sun, Moon, Palette } from 'lucide-react';
import logo3 from '../assets/logo3.png';

const PlantSegmentationInterface = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [colorMap, setColorMap] = useState('default');
  const [is3DView, setIs3DView] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Dummy segmentation data with coordinates for different plant parts
  const segmentationData = {
    leaves: [
      { id: 'leaf1', points: [100, 80, 180, 120, 160, 180, 80, 160], health: 'healthy' },
      { id: 'leaf2', points: [200, 60, 280, 90, 270, 150, 190, 140], health: 'diseased' },
      { id: 'leaf3', points: [320, 100, 400, 110, 390, 180, 310, 170], health: 'healthy' },
      { id: 'leaf4', points: [450, 70, 520, 85, 510, 140, 440, 130], health: 'pest_damage' },
    ],
    stem: [
      { id: 'stem1', points: [250, 180, 280, 180, 285, 350, 245, 350], health: 'healthy' },
    ],
    roots: [
      { id: 'root1', points: [230, 350, 300, 350, 320, 400, 210, 400], health: 'healthy' },
      { id: 'root2', points: [180, 380, 230, 375, 240, 420, 170, 425], health: 'root_rot' },
    ],
    corn: [
      { id: 'corn1', points: [350, 200, 420, 210, 410, 280, 340, 270], health: 'healthy' },
    ]
  };

  const healthColors = {
    healthy: '#10B981',
    diseased: '#EF4444',
    pest_damage: '#F59E0B',
    root_rot: '#8B5CF6',
    default: '#3B82F6'
  };

  const colorMaps = {
    default: { filter: '' },
    thermal: { filter: 'hue-rotate(60deg) saturate(1.5)' },
    infrared: { filter: 'hue-rotate(270deg) saturate(1.8)' },
    vegetation: { filter: 'hue-rotate(120deg) saturate(1.3)' },
    grayscale: { filter: 'grayscale(1)' }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragPosition.x) / zoom;
    const y = (e.clientY - rect.top - dragPosition.y) / zoom;
    
    let foundSegment = null;
    
    // Check all segments to see if mouse is inside any polygon
    Object.entries(segmentationData).forEach(([type, segments]) => {
      segments.forEach(segment => {
        if (isPointInPolygon(x, y, segment.points)) {
          foundSegment = { ...segment, type };
        }
      });
    });
    
    setHoveredSegment(foundSegment);
  };

  const isPointInPolygon = (x, y, points) => {
    let inside = false;
    for (let i = 0, j = points.length - 2; i < points.length; j = i, i += 2) {
      const xi = points[i], yi = points[i + 1];
      const xj = points[j], yj = points[j + 1];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  };

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
  };

  const handleMouseDown = (e) => {
    if (!hoveredSegment) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - dragPosition.x, y: e.clientY - dragPosition.y });
    }
  };

  const handleMouseMoveCanvas = (e) => {
    handleMouseMove(e);
    
    if (isDragging) {
      setDragPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setDragPosition({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setColorMap('default');
  };

  // Create combined filter string
  const getImageFilter = () => {
    const baseFilter = `brightness(${brightness}%) contrast(${contrast}%)`;
    const colorFilter = colorMaps[colorMap].filter;
    return colorFilter ? `${baseFilter} ${colorFilter}` : baseFilter;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f0a8] via-[#7dc788] to-[#275d4f] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logo3} alt="App Logo" className="w-full h-full object-contain" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Plant Segmentation & Analysis</h1>
                <p className="text-emerald-900/70">Advanced AI-powered plant health diagnostics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Main Canvas Area */}
          <div className="xl:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
            {/* Upload Section */}
            {!uploadedImage && (
              <div className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center bg-gradient-to-br from-white/5 to-white/10">
                <div className="text-6xl mb-4">
                  <Upload className="w-16 h-16 mx-auto text-emerald-900/70" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">Upload Plant Image</h3>
                <p className="text-emerald-900/70 mb-6">Drop your image here or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-emerald-900 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 cursor-pointer inline-block font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Choose Image
                </label>
              </div>
            )}

            {/* Image Analysis Canvas */}
            {uploadedImage && (
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-emerald-900">Analysis Results</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIs3DView(!is3DView)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                        is3DView 
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-emerald-900 shadow-lg' 
                          : 'bg-white/20 text-emerald-900/90 hover:bg-white/30'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>3D View</span>
                    </button>
                    <button
                      onClick={resetView}
                      className="px-4 py-2 bg-white/20 text-emerald-900/90 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
                
                <div 
                  className="relative overflow-hidden border-2 border-white/30 rounded-2xl bg-black/20 backdrop-blur-sm"
                  style={{ height: '600px' }}
                >
                  <svg
                    ref={canvasRef}
                    width="100%"
                    height="100%"
                    onMouseMove={handleMouseMoveCanvas}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="cursor-crosshair"
                    style={{ 
                      cursor: isDragging ? 'grabbing' : hoveredSegment ? 'pointer' : 'grab'
                    }}
                  >
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
                      </filter>
                    </defs>
                    
                    <image
                      ref={imageRef}
                      href={uploadedImage}
                      x="0"
                      y="0"
                      width="600"
                      height="400"
                      transform={
                        is3DView
                          ? `translate(${dragPosition.x}, ${dragPosition.y}) scale(${zoom}) rotate(${rotation})`
                          : `translate(${dragPosition.x}, ${dragPosition.y}) scale(${zoom}) rotate(${rotation})`
                      }
                      style={{
                        filter: getImageFilter(),
                        ...(is3DView && {
                          filter: `${getImageFilter()} drop-shadow(5px 5px 10px rgba(0,0,0,0.3))`
                        })
                      }}
                    />
                    
                    {/* Render segments */}
                    {Object.entries(segmentationData).map(([type, segments]) =>
                      segments.map(segment => (
                        <polygon
                          key={segment.id}
                          points={segment.points.map((p, i) => 
                            i % 2 === 0 
                              ? (p * zoom + dragPosition.x) 
                              : (p * zoom + dragPosition.y)
                          ).join(',')}
                          fill={
                            hoveredSegment?.id === segment.id
                              ? `${healthColors[segment.health]}88`
                              : selectedSegment?.id === segment.id
                              ? `${healthColors[segment.health]}66`
                              : `${healthColors[segment.health]}33`
                          }
                          stroke={healthColors[segment.health]}
                          strokeWidth={hoveredSegment?.id === segment.id ? 3 : 2}
                          className="transition-all duration-200"
                          style={{
                            cursor: 'pointer',
                            ...(is3DView && { filter: 'url(#shadow)' })
                          }}
                          onClick={() => handleSegmentClick({ ...segment, type })}
                        />
                      ))
                    )}
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-2 space-y-4">
            {/* Image Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Image Controls
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-900/90 mb-2">
                    Zoom: {zoom.toFixed(1)}x
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-emerald-900"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-green-500"
                    />
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-emerald-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900/90 mb-2">
                    Rotation: {rotation}°
                  </label>
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-4 h-4 text-emerald-900/70" />
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="flex-1 accent-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900/90 mb-2">
                    Brightness: {brightness}%
                  </label>
                  <div className="flex items-center space-x-3">
                    <Sun className="w-4 h-4 text-emerald-900/70" />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="flex-1 accent-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900/90 mb-2">
                    Contrast: {contrast}%
                  </label>
                  <div className="flex items-center space-x-3">
                    <Moon className="w-4 h-4 text-emerald-900/70" />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="flex-1 accent-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900/90 mb-2">
                    Color Map
                  </label>
                  <div className="flex items-center space-x-3">
                    <Palette className="w-4 h-4 text-emerald-900/70" />
                    <select
                      value={colorMap}
                      onChange={(e) => setColorMap(e.target.value)}
                      className="flex-1 p-2 bg-white/20 border border-white/30 rounded-lg text-emerald-900 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="default">Default</option>
                      <option value="thermal">Thermal</option>
                      <option value="infrared">Infrared</option>
                      <option value="vegetation">Vegetation</option>
                      <option value="grayscale">Grayscale</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Segment Analysis */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">Segment Analysis</h3>
              
              {hoveredSegment && (
                <div className="p-4 bg-white/20 rounded-lg mb-4 backdrop-blur-sm">
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Hovered: {hoveredSegment.type} ({hoveredSegment.id})
                  </h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: healthColors[hoveredSegment.health] }}
                    />
                    <span className="text-sm text-emerald-900/80 capitalize">
                      {hoveredSegment.health.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              {selectedSegment && (
                <div className="p-4 bg-blue-500/30 rounded-lg mb-4 backdrop-blur-sm">
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Selected: {selectedSegment.type} ({selectedSegment.id})
                  </h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: healthColors[selectedSegment.health] }}
                    />
                    <span className="text-sm text-emerald-900/80 capitalize">
                      {selectedSegment.health.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Segment Legend */}
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-900">Legend</h4>
                {Object.entries(segmentationData).map(([type, segments]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {type === 'leaves' && <span>🍃</span>}
                      {type === 'stem' && <span>🌿</span>}
                      {type === 'corn' && <span>🌽</span>}
                      {type === 'roots' && <span>🌰</span>}
                      <span className="text-sm text-emerald-900/80 capitalize">{type}</span>
                    </div>
                    <span className="text-sm text-emerald-900/70 font-medium">{segments.length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">Health Summary</h3>
              <div className="space-y-3">
                {Object.entries(healthColors).filter(([key]) => key !== 'default').map(([health, color]) => {
                  const count = Object.values(segmentationData).flat().filter(s => s.health === health).length;
                  return (
                    <div key={health} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-sm text-emerald-900/80 capitalize">{health.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm font-medium text-emerald-900 bg-white/20 px-2 py-1 rounded-full">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantSegmentationInterface;