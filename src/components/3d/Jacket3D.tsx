import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFabricTexture } from '../../utils/fabricTextures';

interface ModelProps {
  color: string;
  decal?: string;
  wireframe?: boolean;
}

export const Jacket3D: React.FC<ModelProps> = ({ color, decal, wireframe = false }) => {
  const bumpTexture = useMemo(() => createFabricTexture('nylon'), []);

  const decalTexture = useMemo(() => {
    if (!decal || decal === 'None') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 512);
    ctx.strokeStyle = '#38BDF8';
    ctx.fillStyle = '#38BDF8';
    ctx.lineWidth = 8;

    ctx.strokeRect(100, 180, 312, 140);
    ctx.font = 'bold 36px monospace';
    ctx.fillText('TACTICAL Vanguard', 110, 240);
    ctx.font = '20px monospace';
    ctx.fillText('SPEC 3.0 // WATERPROOF', 115, 280);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [decal]);

  return (
    <group position={[0, -0.1, 0]}>
      {/* 3-Layer GORE-TEX Jacket Main Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.86, 0.88, 1.45, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.15}
          bumpMap={bumpTexture}
          bumpScale={0.012}
          wireframe={wireframe}
        />
      </mesh>

      {/* Storm Stand Collar */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.35, 36]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.2} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
      </mesh>

      {/* Center YKK AquaGuard Zipper Track */}
      <mesh position={[0, -0.02, 0.88]}>
        <boxGeometry args={[0.05, 1.42, 0.04]} />
        <meshStandardMaterial color="#64748B" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Zipper Pull Metallic Slider */}
      <mesh position={[0, 0.3, 0.91]}>
        <boxGeometry args={[0.08, 0.12, 0.05]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Tactical Flap Chest Pocket Left */}
      <mesh position={[-0.4, 0.25, 0.87]}>
        <boxGeometry args={[0.34, 0.34, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} bumpMap={bumpTexture} bumpScale={0.02} />
      </mesh>
      {/* Magnetic Strap Clip Left */}
      <mesh position={[-0.4, 0.1, 0.92]}>
        <boxGeometry args={[0.1, 0.06, 0.04]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Tactical Flap Chest Pocket Right */}
      <mesh position={[0.4, 0.25, 0.87]}>
        <boxGeometry args={[0.34, 0.34, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} bumpMap={bumpTexture} bumpScale={0.02} />
      </mesh>
      <mesh position={[0.4, 0.1, 0.92]}>
        <boxGeometry args={[0.1, 0.06, 0.04]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Left Articulated Sleeve */}
      <group position={[-0.94, 0.4, 0]} rotation={[0, 0, 0.42]}>
        <mesh castShadow position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.3, 0.26, 0.9, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} bumpMap={bumpTexture} bumpScale={0.012} wireframe={wireframe} />
        </mesh>

        {/* Sleeve Arm Utility Zipper Pocket */}
        <mesh position={[-0.15, -0.2, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.22]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>

        {/* Adjustable Velcro Wrist Strap */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.12, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Articulated Sleeve */}
      <group position={[0.94, 0.4, 0]} rotation={[0, 0, -0.42]}>
        <mesh castShadow position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.3, 0.26, 0.9, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} bumpMap={bumpTexture} bumpScale={0.012} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.12, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
      </group>

      {/* Reflective Back Strip */}
      <mesh position={[0, 0.1, -0.88]}>
        <boxGeometry args={[0.8, 0.06, 0.03]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.1} metalness={0.9} emissive="#0284C7" emissiveIntensity={0.3} />
      </mesh>

      {/* Tactical Badge Decal */}
      {decalTexture && (
        <mesh position={[0, 0.38, 0.89]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshBasicMaterial map={decalTexture} transparent={true} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
