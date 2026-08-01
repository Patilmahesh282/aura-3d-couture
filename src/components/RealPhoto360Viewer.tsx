import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Play, Pause, Compass, ZoomIn, ZoomOut, Eye, Sparkles } from 'lucide-react';

interface RealPhoto360ViewerProps {
  photos: string[];
  productName: string;
  autoRotate?: boolean;
  showControls?: boolean;
  onOpenStudio3D?: () => void;
}

export const RealPhoto360Viewer: React.FC<RealPhoto360ViewerProps> = ({
  photos,
  productName,
  autoRotate: initialAutoRotate = false,
  showControls = true,
  onOpenStudio3D
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(initialAutoRotate);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Angle calculated based on index (e.g. 4 photos -> 0°, 90°, 180°, 270°)
  const numPhotos = photos.length || 1;
  const currentAngle = Math.round((currentIdx / numPhotos) * 360);

  // Auto-spin interval
  useEffect(() => {
    if (!isAutoRotate || isDragging || numPhotos <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % numPhotos);
    }, 1800);
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging, numPhotos]);

  // Handle Drag / Touch rotation
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || numPhotos <= 1) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - startX;

      // Sensitivity factor
      if (Math.abs(deltaX) > 25) {
        if (deltaX < 0) {
          setCurrentIdx((prev) => (prev + 1) % numPhotos);
        } else {
          setCurrentIdx((prev) => (prev - 1 + numPhotos) % numPhotos);
        }
        setStartX(clientX);
      }
    },
    [isDragging, startX, numPhotos]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Magnifying Glass Zoom on Hover
  const handleImageHoverMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const getAngleLabel = (idx: number) => {
    const angle = (idx / numPhotos) * 360;
    if (angle < 45 || angle >= 315) return 'Real Garment - 0° Front View';
    if (angle >= 45 && angle < 135) return 'Real Garment - 90° Profile View';
    if (angle >= 135 && angle < 225) return 'Real Garment - 180° Rear Back';
    return 'Real Garment - 270° Texture Detail';
  };

  return (
    <div className="w-full h-full relative select-none group bg-slate-950 overflow-hidden flex flex-col justify-between">
      
      {/* 360° Live HUD Badge */}
      {showControls && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-400 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: isAutoRotate ? '3s' : '0s' }} />
          <span>
            <b>Real Photo 360°:</b> {currentAngle}° ({getAngleLabel(currentIdx)})
          </span>
        </div>
      )}

      {/* Top Action Bar */}
      {showControls && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
          
          {/* Quick Snap Angles */}
          <div className="hidden sm:flex items-center gap-1 pr-2 border-r border-slate-800">
            {photos.map((_, idx) => {
              const deg = Math.round((idx / numPhotos) * 360);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setIsAutoRotate(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    currentIdx === idx
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`View ${deg}° Angle`}
                >
                  {deg}°
                </button>
              );
            })}
          </div>

          {/* Auto-Spin Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-1.5 rounded-lg transition-all ${
              isAutoRotate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title={isAutoRotate ? 'Pause 360° Photo Spin' : 'Start 360° Photo Spin'}
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className={`p-1.5 rounded-lg transition-all ${
              isZoomed ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title={isZoomed ? 'Reset Normal View' : 'Zoom In Fabric Stitching'}
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
          </button>

          {/* Optional Switch to 3D Canvas Button */}
          {onOpenStudio3D && (
            <button
              onClick={onOpenStudio3D}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-[10px] font-bold flex items-center gap-1 hover:brightness-110 shadow"
            >
              <Eye className="w-3 h-3" /> 3D Canvas
            </button>
          )}
        </div>
      )}

      {/* Main Image Display Box with Drag Listener */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleImageHoverMove}
        className={`w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden transition-all ${
          isDragging ? 'scale-[0.99]' : ''
        }`}
      >
        <img
          src={photos[currentIdx] || photos[0]}
          alt={`${productName} Angle ${currentAngle}°`}
          referrerPolicy="no-referrer"
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: 'scale(2.2)',
                  transition: 'transform 0.1s ease-out'
                }
              : { transform: 'scale(1)', transition: 'all 0.3s ease-out' }
          }
          className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
        />

        {/* Real World Verified Quality Badge */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Real Garment Photo</span>
        </div>
      </div>

      {/* Bottom Drag Guidance */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <RotateCcw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Drag horizontally to rotate real garment 360° ({currentIdx + 1}/{numPhotos} angles)</span>
        </div>
      )}
    </div>
  );
};
