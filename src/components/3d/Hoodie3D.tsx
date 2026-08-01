import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFabricTexture } from '../../utils/fabricTextures';

interface ModelProps {
  color: string;
  decal?: string;
  wireframe?: boolean;
}

export const Hoodie3D: React.FC<ModelProps> = ({ color, decal, wireframe = false }) => {
  const bumpTexture = useMemo(() => createFabricTexture('fleece'), []);

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
    ctx.lineWidth = 10;

    if (decal.includes('AURA Emblem')) {
      ctx.beginPath();
      ctx.arc(256, 256, 120, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('AURA 3D', 180, 265);
    } else if (decal.includes('Cyber Mesh')) {
      ctx.font = 'bold 36px monospace';
      ctx.fillText('⚡ CYBER // 01', 130, 240);
      ctx.strokeRect(90, 160, 332, 160);
    } else if (decal.includes('Japanese Katakana')) {
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText('オーラ・服', 140, 270);
    } else {
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('SPEC /// 450GSM', 110, 260);
      ctx.strokeRect(80, 190, 350, 120);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [decal]);

  return (
    <group position={[0, -0.15, 0]}>
      {/* Heavy Oversized Torso */}
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.82, 0.8, 1.45, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.02}
          bumpMap={bumpTexture}
          bumpScale={0.02}
          wireframe={wireframe}
        />
      </mesh>

      {/* Ribbed Bottom Waist Hem */}
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.18, 48]} />
        <meshStandardMaterial color={color} roughness={0.85} bumpMap={bumpTexture} bumpScale={0.03} />
      </mesh>

      {/* Outer Double-Layered Hood Shell */}
      <group position={[0, 0.82, -0.15]} rotation={[0.2, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.52, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          <meshStandardMaterial color={color} roughness={0.75} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        {/* Inner Dark Hood Lining Cavity */}
        <mesh position={[0, -0.02, 0.05]}>
          <sphereGeometry args={[0.48, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#0A0D12" roughness={0.9} />
        </mesh>
      </group>

      {/* Front Kangaroo Pouch Pocket */}
      <group position={[0, -0.38, 0.78]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.42, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.7} bumpMap={bumpTexture} bumpScale={0.02} />
        </mesh>
        {/* Pocket Side Hand Slits */}
        <mesh position={[-0.42, 0, 0.02]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.08, 0.36, 0.08]} />
          <meshStandardMaterial color="#000000" roughness={0.8} />
        </mesh>
        <mesh position={[0.42, 0, 0.02]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.08, 0.36, 0.08]} />
          <meshStandardMaterial color="#000000" roughness={0.8} />
        </mesh>
      </group>

      {/* Metal Drawstring Eyelets */}
      <mesh position={[-0.15, 0.65, 0.72]}>
        <torusGeometry args={[0.035, 0.012, 12, 24]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.65, 0.72]}>
        <torusGeometry args={[0.035, 0.012, 12, 24]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Left Dangling Drawstring Cord with Aglet */}
      <group position={[-0.15, 0.32, 0.74]} rotation={[0, 0, -0.05]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
        </mesh>
        {/* Metallic Aglet Tip */}
        <mesh position={[0, -0.31, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
          <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Right Dangling Drawstring Cord */}
      <group position={[0.15, 0.32, 0.74]} rotation={[0, 0, 0.05]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.31, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
          <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Left Drop-Shoulder Sleeve */}
      <group position={[-0.95, 0.38, 0]} rotation={[0, 0, 0.42]}>
        <mesh castShadow position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.88, 32]} />
          <meshStandardMaterial color={color} roughness={0.7} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        {/* Ribbed Sleeve Cuff */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 32]} />
          <meshStandardMaterial color={color} roughness={0.85} bumpMap={bumpTexture} bumpScale={0.03} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group position={[0.95, 0.38, 0]} rotation={[0, 0, -0.42]}>
        <mesh castShadow position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.88, 32]} />
          <meshStandardMaterial color={color} roughness={0.7} bumpMap={bumpTexture} bumpScale={0.02} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 32]} />
          <meshStandardMaterial color={color} roughness={0.85} bumpMap={bumpTexture} bumpScale={0.03} />
        </mesh>
      </group>

      {/* Center Decal */}
      {decalTexture && (
        <mesh position={[0, 0.12, 0.8]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial map={decalTexture} transparent={true} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
