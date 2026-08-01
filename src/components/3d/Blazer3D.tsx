import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFabricTexture } from '../../utils/fabricTextures';

interface ModelProps {
  color: string;
  decal?: string;
  wireframe?: boolean;
}

export const Blazer3D: React.FC<ModelProps> = ({ color, wireframe = false }) => {
  const bumpTexture = useMemo(() => createFabricTexture('cotton'), []);

  return (
    <group position={[0, -0.1, 0]}>
      {/* Structured Tailored Torso */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.82, 0.86, 1.45, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.05}
          bumpMap={bumpTexture}
          bumpScale={0.015}
          wireframe={wireframe}
        />
      </mesh>

      {/* Tailored Shoulder Pads */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.92, 0.82, 0.22, 48]} />
        <meshStandardMaterial color={color} roughness={0.5} bumpMap={bumpTexture} bumpScale={0.015} wireframe={wireframe} />
      </mesh>

      {/* Sharp V-Neck Satin Lapel Left */}
      <mesh position={[-0.22, 0.35, 0.82]} rotation={[0.1, 0.25, -0.2]}>
        <boxGeometry args={[0.26, 0.65, 0.05]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Sharp Satin Lapel Right */}
      <mesh position={[0.22, 0.35, 0.82]} rotation={[0.1, -0.25, 0.2]}>
        <boxGeometry args={[0.26, 0.65, 0.05]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Inner Silk Dress Shirt & Tie */}
      <mesh position={[0, 0.4, 0.78]}>
        <boxGeometry args={[0.22, 0.5, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0.8]}>
        <boxGeometry args={[0.08, 0.45, 0.02]} />
        <meshStandardMaterial color="#0284C7" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Left Breast Welt Pocket with Pocket Square */}
      <mesh position={[-0.38, 0.28, 0.84]}>
        <boxGeometry args={[0.22, 0.08, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[-0.38, 0.33, 0.85]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.14, 0.08, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* Double Lower Flap Pockets */}
      <mesh position={[-0.4, -0.25, 0.84]}>
        <boxGeometry args={[0.32, 0.12, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.5} bumpMap={bumpTexture} bumpScale={0.02} />
      </mesh>
      <mesh position={[0.4, -0.25, 0.84]}>
        <boxGeometry args={[0.32, 0.12, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.5} bumpMap={bumpTexture} bumpScale={0.02} />
      </mesh>

      {/* Metallic Front Buttons */}
      <mesh position={[0.08, 0.05, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 24]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0.08, -0.22, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 24]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Left Sleeve */}
      <group position={[-0.92, 0.42, 0]} rotation={[0, 0, 0.38]}>
        <mesh castShadow position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.28, 0.24, 0.9, 32]} />
          <meshStandardMaterial color={color} roughness={0.5} bumpMap={bumpTexture} bumpScale={0.015} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group position={[0.92, 0.42, 0]} rotation={[0, 0, -0.38]}>
        <mesh castShadow position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.28, 0.24, 0.9, 32]} />
          <meshStandardMaterial color={color} roughness={0.5} bumpMap={bumpTexture} bumpScale={0.015} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
};
