import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFabricTexture } from '../../utils/fabricTextures';

interface ModelProps {
  color: string;
  decal?: string;
  wireframe?: boolean;
}

export const Sneaker3D: React.FC<ModelProps> = ({ color, wireframe = false }) => {
  const bumpTexture = useMemo(() => createFabricTexture('knit'), []);

  return (
    <group position={[0, -0.25, 0]} rotation={[0.15, -0.5, 0]}>
      {/* 3D Printed Lattice Midsole */}
      <mesh castShadow receiveShadow position={[0, -0.38, 0]}>
        <boxGeometry args={[0.92, 0.24, 1.85]} />
        <meshStandardMaterial color="#0284C7" roughness={0.2} metalness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Rubber Outsole Tread Trim */}
      <mesh position={[0, -0.48, 0]}>
        <boxGeometry args={[0.94, 0.08, 1.88]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} />
      </mesh>

      {/* Rubber Midsole Edge Band */}
      <mesh position={[0, -0.24, 0]}>
        <boxGeometry args={[0.9, 0.08, 1.8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
      </mesh>

      {/* FlyKnit Upper Main Body */}
      <mesh castShadow position={[0, 0.12, -0.08]}>
        <boxGeometry args={[0.82, 0.58, 1.25]} />
        <meshStandardMaterial color={color} roughness={0.6} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
      </mesh>

      {/* Curved Reinforced Toe Cap */}
      <mesh position={[0, -0.04, 0.65]}>
        <sphereGeometry args={[0.44, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={color} roughness={0.4} bumpMap={bumpTexture} bumpScale={0.015} />
      </mesh>

      {/* Padded Ankle Heel Collar */}
      <mesh position={[0, 0.52, -0.42]}>
        <cylinderGeometry args={[0.35, 0.39, 0.48, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} bumpMap={bumpTexture} bumpScale={0.02} />
      </mesh>

      {/* Heel Pull Loop Tab */}
      <mesh position={[0, 0.65, -0.62]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.12, 0.28, 0.04]} />
        <meshStandardMaterial color="#0284C7" roughness={0.3} />
      </mesh>

      {/* Padded Tongue */}
      <mesh position={[0, 0.48, 0.12]} rotation={[-0.38, 0, 0]}>
        <boxGeometry args={[0.38, 0.58, 0.08]} />
        <meshStandardMaterial color="#0F172A" roughness={0.7} />
      </mesh>

      {/* Lacing Locks & Bands */}
      {[-0.18, 0.02, 0.22, 0.42].map((zPos, idx) => (
        <mesh key={idx} position={[0, 0.22 + idx * 0.07, zPos]}>
          <boxGeometry args={[0.5, 0.04, 0.05]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.8} />
        </mesh>
      ))}

      {/* Cyber Side Swoosh / Heel Accent */}
      <mesh position={[0.42, 0.15, -0.2]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.25, 0.6]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.9} emissive="#0284C7" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};
