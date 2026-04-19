/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const AntigravityInner = ({
  count = 300, magnetRadius = 10, ringRadius = 10, waveSpeed = 0.4,
  waveAmplitude = 1, particleSize = 2, lerpSpeed = 0.1, color = '#FF9FFC',
  autoAnimate = false, particleVariance = 1, rotationSpeed = 0,
  depthFactor = 1, pulseSpeed = 3, particleShape = 'capsule', fieldStrength = 10
}) => {
  const meshRef = useRef(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;
      temp.push({ t: Math.random() * 100, speed: 0.01 + Math.random() / 200, mx: x, my: y, mz: z, cx: x, cy: y, cz: z, randomRadiusOffset: (Math.random() - 0.5) * 2 });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame(state => {
    const { viewport: v, pointer: m, clock } = state;
    virtualMouse.current.x += ((m.x * v.width) / 2 - virtualMouse.current.x) * 0.05;
    virtualMouse.current.y += ((m.y * v.height) / 2 - virtualMouse.current.y) * 0.05;

    particles.forEach((particle, i) => {
      particle.t += particle.speed / 2;
      const dx = particle.mx - virtualMouse.current.x;
      const dy = particle.my - virtualMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetPos = { x: particle.mx, y: particle.my, z: particle.mz * depthFactor };
      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + clock.getElapsedTime() * rotationSpeed;
        const currentRingRadius = ringRadius + Math.sin(particle.t * waveSpeed + angle) * (0.5 * waveAmplitude) + (particle.randomRadiusOffset * (5 / (fieldStrength + 0.1)));
        targetPos.x = virtualMouse.current.x + currentRingRadius * Math.cos(angle);
        targetPos.y = virtualMouse.current.y + currentRingRadius * Math.sin(angle);
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(virtualMouse.current.x, virtualMouse.current.y, particle.cz);
      dummy.rotateX(Math.PI / 2);
      const s = Math.max(0, Math.min(1, 1 - Math.abs(Math.sqrt(Math.pow(particle.cx - virtualMouse.current.x, 2) + Math.pow(particle.cy - virtualMouse.current.y, 2)) - ringRadius) / 10)) * (0.8 + Math.sin(particle.t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

const Antigravity = props => (
  <Canvas camera={{ position: [0, 0, 50], fov: 35 }} style={{ background: '#060010' }}>
    <AntigravityInner {...props} />
  </Canvas>
);

export default Antigravity;