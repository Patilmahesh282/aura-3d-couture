import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFabricTexture } from '../../utils/fabricTextures';

interface ModelProps {
  color: string;
  decal?: string;
  wireframe?: boolean;
}

export const Pants3D: React.FC<ModelProps> = ({ color, wireframe = false }) => {
  const bumpTexture = useMemo(() => createFabricTexture('denim'), []);

  return (
    <group position={[0, -0.15, 0]}>
      {/* Waistband with Stitched Loops */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.18, 36]} />
        <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
      </mesh>

      {/* Belt Loops */}
      {[-0.4, -0.15, 0.15, 0.4].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 0.85, 0.61]}>
          <boxGeometry args={[0.04, 0.16, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}

      {/* Zipper Fly Seam Line */}
      <mesh position={[0, 0.68, 0.62]}>
        <boxGeometry args={[0.02, 0.22, 0.02]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      {/* Hips & Crotch Volume */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.62, 0.64, 0.38, 36]} />
        <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
      </mesh>

      {/* Left Leg */}
      <group position={[-0.29, 0.05, 0]}>
        {/* Thigh */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.33, 0.27, 0.75, 32]} />
          <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        {/* Reinforced Knee Articulation Dart */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.27, 0.25, 0.14, 32]} />
          <meshStandardMaterial color={color} roughness={0.75} bumpMap={bumpTexture} bumpScale={0.03} />
        </mesh>
        {/* Tapered Calf */}
        <mesh castShadow position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.25, 0.2, 0.72, 32]} />
          <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        {/* Ankle Quick-Release Strap Cuff */}
        <mesh position={[0, -1.02, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>

        {/* 3D Cargo Compartment Pocket Left */}
        <group position={[-0.24, 0.05, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.42, 0.32]} />
            <meshStandardMaterial color={color} roughness={0.7} bumpMap={bumpTexture} bumpScale={0.025} />
          </mesh>
          {/* Flap Cover */}
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.34]} />
            <meshStandardMaterial color="#0F172A" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.29, 0.05, 0]}>
        {/* Thigh */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.33, 0.27, 0.75, 32]} />
          <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        {/* Knee Articulation Dart */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.27, 0.25, 0.14, 32]} />
          <meshStandardMaterial color={color} roughness={0.75} bumpMap={bumpTexture} bumpScale={0.03} />
        </mesh>
        {/* Tapered Calf */}
        <mesh castShadow position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.25, 0.2, 0.72, 32]} />
          <meshStandardMaterial color={color} roughness={0.65} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        {/* Ankle Quick-Release Strap Cuff */}
        <mesh position={[0, -1.02, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>

        {/* 3D Cargo Compartment Pocket Right */}
        <group position={[0.24, 0.05, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.42, 0.32]} />
            <meshStandardMaterial color={color} roughness={0.7} bumpMap={bumpTexture} bumpScale={0.025} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.34]} />
            <meshStandardMaterial color="#0F172A" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
