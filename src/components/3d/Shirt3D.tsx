import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFabricTexture } from '../../utils/fabricTextures';

interface ModelProps {
  color: string;
  decal?: string;
  wireframe?: boolean;
}

export const Shirt3D: React.FC<ModelProps> = ({ color, decal, wireframe = false }) => {
  // Realistic fabric bump texture map
  const bumpTexture = useMemo(() => createFabricTexture('cotton'), []);

  // Decal graphics canvas
  const decalTexture = useMemo(() => {
    if (!decal || decal === 'None') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 512);
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 8;

    if (decal.includes('AURA Tech Code')) {
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('AURA 2026', 130, 220);
      ctx.font = '24px monospace';
      ctx.fillText('// HIGH PRECISION FABRIC', 110, 270);
      ctx.strokeRect(100, 150, 312, 160);
    } else if (decal.includes('Holographic Circuit')) {
      ctx.beginPath();
      ctx.arc(256, 256, 120, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(256, 256, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(250, 80, 12, 60);
      ctx.fillRect(250, 372, 12, 60);
      ctx.fillRect(80, 250, 60, 12);
      ctx.fillRect(372, 250, 60, 12);
    } else {
      ctx.beginPath();
      ctx.moveTo(100, 256);
      ctx.bezierCurveTo(200, 150, 300, 350, 412, 256);
      ctx.stroke();
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('A U R A', 190, 320);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [decal]);

  return (
    <group position={[0, -0.1, 0]}>
      {/* Main Body Torso (Heavyweight Cotton Drop-Shoulder Fit) */}
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.76, 0.74, 1.45, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.02}
          bumpMap={bumpTexture}
          bumpScale={0.015}
          wireframe={wireframe}
        />
      </mesh>

      {/* Ribbed Crew Neck Collar */}
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.34, 0.06, 24, 48]} />
        <meshStandardMaterial color={color} roughness={0.8} bumpMap={bumpTexture} bumpScale={0.025} wireframe={wireframe} />
      </mesh>

      {/* Inner Collar Opening Accent */}
      <mesh position={[0, 0.71, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.05, 32]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      {/* Shoulder Yoke Folds */}
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.9, 0.76, 0.28, 48]} />
        <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.015} wireframe={wireframe} />
      </mesh>

      {/* Bottom Hem Stitching Line */}
      <mesh position={[0, -0.76, 0]}>
        <torusGeometry args={[0.74, 0.025, 16, 48]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Left Sleeve (Drop Shoulder Cut) */}
      <group position={[-0.88, 0.44, 0]} rotation={[0, 0, 0.48]}>
        <mesh castShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.27, 0.29, 0.58, 32]} />
          <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.015} wireframe={wireframe} />
        </mesh>
        {/* Sleeve Hem Ribbing */}
        <mesh position={[0, -0.5, 0]}>
          <torusGeometry args={[0.28, 0.02, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group position={[0.88, 0.44, 0]} rotation={[0, 0, -0.48]}>
        <mesh castShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.27, 0.29, 0.58, 32]} />
          <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.015} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <torusGeometry args={[0.28, 0.02, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>

      {/* Left Chest Pocket Option */}
      <mesh position={[-0.32, 0.25, 0.74]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.28, 0.32, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} />
      </mesh>

      {/* Chest Decal Print */}
      {decalTexture && (
        <mesh position={[0.05, 0.1, 0.76]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial map={decalTexture} transparent={true} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
