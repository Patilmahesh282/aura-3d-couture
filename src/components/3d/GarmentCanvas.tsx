import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment, Lightformer } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Shirt3D } from './Shirt3D';
import { Hoodie3D } from './Hoodie3D';
import { Jacket3D } from './Jacket3D';
import { Pants3D } from './Pants3D';
import { Sneaker3D } from './Sneaker3D';
import { Blazer3D } from './Blazer3D';
import { RotateCcw, Play, Pause, Compass, Eye, Sun, Sparkles, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface GarmentCanvasProps {
  modelType: 'hoodie' | 'shirt' | 'jacket' | 'pants' | 'sneaker' | 'blazer';
  color: string;
  decal?: string;
  autoRotate?: boolean;
  environmentPreset?: 'studio' | 'cyberpunk' | 'sunset' | 'gallery';
  enableFloat?: boolean;
  scale?: number;
  showControls?: boolean;
}

// Inner helper component to calculate and emit live 360° azimuthal angle
const CameraAngleTracker: React.FC<{ onAngleChange: (angle: number) => void }> = ({ onAngleChange }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (camera) {
      const angleRad = Math.atan2(camera.position.x, camera.position.z);
      let deg = Math.round((angleRad * 180) / Math.PI);
      if (deg < 0) deg += 360;
      onAngleChange(deg);
    }
  });
  return null;
};

export const GarmentCanvas: React.FC<GarmentCanvasProps> = ({
  modelType,
  color,
  decal,
  autoRotate: initialAutoRotate = true,
  environmentPreset: initialEnv = 'studio',
  enableFloat = true,
  scale = 1,
  showControls = true
}) => {
  const [isAutoRotate, setIsAutoRotate] = useState(initialAutoRotate);
  const [envPreset, setEnvPreset] = useState<'studio' | 'cyberpunk' | 'sunset' | 'gallery'>(initialEnv);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);

  const orbitRef = useRef<OrbitControlsImpl | null>(null);

  const renderModel = () => {
    switch (modelType) {
      case 'hoodie':
        return <Hoodie3D color={color} decal={decal} wireframe={wireframeMode} />;
      case 'shirt':
        return <Shirt3D color={color} decal={decal} wireframe={wireframeMode} />;
      case 'jacket':
        return <Jacket3D color={color} decal={decal} wireframe={wireframeMode} />;
      case 'pants':
        return <Pants3D color={color} decal={decal} wireframe={wireframeMode} />;
      case 'sneaker':
        return <Sneaker3D color={color} decal={decal} wireframe={wireframeMode} />;
      case 'blazer':
        return <Blazer3D color={color} decal={decal} wireframe={wireframeMode} />;
      default:
        return <Hoodie3D color={color} decal={decal} wireframe={wireframeMode} />;
    }
  };

  // Preset 360° snap angles (0° Front, 90° Right, 180° Back, 270° Left)
  const setPresetAngle = useCallback((degrees: number) => {
    if (orbitRef.current) {
      setIsAutoRotate(false);
      const rad = (degrees * Math.PI) / 180;
      orbitRef.current.setAzimuthalAngle(rad);
      orbitRef.current.update();
    }
  }, []);

  const handleZoom = (delta: number) => {
    if (orbitRef.current) {
      const controls = orbitRef.current;
      const targetDist = controls.getDistance() + delta;
      if (targetDist >= controls.minDistance && targetDist <= controls.maxDistance) {
        controls.object.position.multiplyScalar(targetDist / controls.getDistance());
        controls.update();
      }
    }
  };

  const getAngleLabel = (deg: number) => {
    if (deg >= 315 || deg < 45) return 'Front View';
    if (deg >= 45 && deg < 135) return 'Right Side View';
    if (deg >= 135 && deg < 225) return 'Back View';
    return 'Left Side View';
  };

  return (
    <div className="w-full h-full relative select-none group">
      {/* 360° Live Angle HUD Badge */}
      {showControls && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-400 shadow-lg">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isAutoRotate ? '4s' : '0s' }} />
          <span>
            <b>360° Angle:</b> {currentAngle}° ({getAngleLabel(currentAngle)})
          </span>
        </div>
      )}

      {/* 360° Quick Snap Rotation & Mode Bar */}
      {showControls && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
          {/* Quick Angle Buttons */}
          <div className="hidden sm:flex items-center gap-1 pr-2 border-r border-slate-800">
            <button
              id="snap-angle-0"
              onClick={() => setPresetAngle(0)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                currentAngle >= 340 || currentAngle <= 20 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="View Front (0°)"
            >
              0° Front
            </button>
            <button
              id="snap-angle-90"
              onClick={() => setPresetAngle(90)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                currentAngle >= 70 && currentAngle <= 110 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="View Right Side (90°)"
            >
              90° Right
            </button>
            <button
              id="snap-angle-180"
              onClick={() => setPresetAngle(180)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                currentAngle >= 160 && currentAngle <= 200 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="View Back (180°)"
            >
              180° Back
            </button>
            <button
              id="snap-angle-270"
              onClick={() => setPresetAngle(270)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                currentAngle >= 250 && currentAngle <= 290 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="View Left Side (270°)"
            >
              270° Left
            </button>
          </div>

          {/* Auto-Spin 360° Toggle */}
          <button
            id="toggle-auto-rotate"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-1.5 rounded-lg transition-all ${
              isAutoRotate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title={isAutoRotate ? 'Pause 360° Auto-Spin' : 'Start 360° Auto-Spin'}
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Wireframe vs Fabric Material */}
          <button
            id="toggle-wireframe"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-1.5 rounded-lg transition-all ${
              wireframeMode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title={wireframeMode ? 'Switch to Fabric Material' : 'Switch to 3D Wireframe Mesh'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Zoom In / Out */}
          <button
            id="zoom-in-btn"
            onClick={() => handleZoom(-0.5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="zoom-out-btn"
            onClick={() => handleZoom(0.5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag Guidance Toast */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <RotateCcw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Click & Drag anywhere to rotate 360° • Scroll to Zoom</span>
        </div>
      )}

      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-5, -2, -5]} intensity={0.5} color="#60A5FA" />
        <spotLight position={[0, 10, 0]} intensity={0.9} angle={0.5} penumbra={1} />

        {/* Environment Presets */}
        {envPreset === 'cyberpunk' && <color attach="background" args={['#09090b']} />}
        {envPreset === 'cyberpunk' && (
          <group position={[0, 0, 0]}>
            <Lightformer intensity={2} color="#ec4899" position={[2, 3, 2]} scale={[5, 1, 1]} />
            <Lightformer intensity={2} color="#3b82f6" position={[-2, 3, 2]} scale={[5, 1, 1]} />
          </group>
        )}
        {envPreset === 'studio' && <Environment preset="city" />}
        {envPreset === 'sunset' && <Environment preset="sunset" />}
        {envPreset === 'gallery' && <Environment preset="apartment" />}

        <Suspense fallback={null}>
          <CameraAngleTracker onAngleChange={setCurrentAngle} />

          <group scale={scale}>
            {enableFloat && !wireframeMode ? (
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
                {renderModel()}
              </Float>
            ) : (
              renderModel()
            )}
          </group>

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.65}
            scale={6}
            blur={2.4}
            far={4}
          />
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          enableZoom={true}
          minDistance={2.0}
          maxDistance={6.5}
          autoRotate={isAutoRotate}
          autoRotateSpeed={1.8}
        />
      </Canvas>
    </div>
  );
};
