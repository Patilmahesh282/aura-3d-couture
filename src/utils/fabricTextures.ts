import * as THREE from 'three';

// Generates procedural fabric textures (bump & rough maps) to simulate actual woven cotton, fleece, nylon, and denim
export const createFabricTexture = (type: 'cotton' | 'fleece' | 'nylon' | 'denim' | 'knit'): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base background neutral
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  if (type === 'cotton' || type === 'knit') {
    // Fine woven threads grid
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#909090';
    for (let i = 0; i < 512; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Micro stitching noise
    ctx.fillStyle = '#A0A0A0';
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  } else if (type === 'denim') {
    // Diagonal twill weave
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#656565';
    for (let i = -512; i < 1024; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }
  } else if (type === 'nylon') {
    // Ripstop grid texture
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#B0B0B0';
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
  } else if (type === 'fleece') {
    // Soft organic fleece noise pattern
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 2 + 1;
      const shade = Math.floor(Math.random() * 40 + 110);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
};
