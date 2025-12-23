import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Signal = ({ start, end, onDone, isDark }) => {
  const [progress, setProgress] = useState(0);

  useFrame(() => {
    if (progress < 1) {
      setProgress(p => p + 0.02);
    } else {
      onDone();
    }
  });

  const pos = useMemo(() => new THREE.Vector3().lerpVectors(start, end, progress), [start, end, progress]);

  return (
    <mesh position={[pos.x, pos.y, pos.z]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={isDark ? "#00f2ff" : "#00bcd4"} transparent opacity={0.9} />
    </mesh>
  );
};

const Network = ({ isDark }) => {
  const groupRef = useRef();
  const [signals, setSignals] = useState([]);
  
  const { positions, connections } = useMemo(() => {
    const nodes = [];
    const count = 50;
    const radius = 8;
    
    for (let i = 0; i < count; i++) {
        nodes.push(new THREE.Vector3(
          (Math.random() - 0.5) * radius * 2.5,
          (Math.random() - 0.5) * radius * 2,
          (Math.random() - 0.5) * radius
        ));
    }

    const conns = [];
    for (let i = 0; i < count; i++) {
        let countPerNode = 0;
        for (let j = i + 1; j < count; j++) {
            if (nodes[i].distanceTo(nodes[j]) < 5.5 && countPerNode < 2) {
                conns.push({ start: nodes[i], end: nodes[j] });
                countPerNode++;
            }
        }
    }

    const posArray = new Float32Array(nodes.length * 3);
    nodes.forEach((v, i) => {
      posArray[i * 3] = v.x;
      posArray[i * 3 + 1] = v.y;
      posArray[i * 3 + 2] = v.z;
    });

    return { positions: posArray, connections: conns };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.02;

    if (Math.random() < 0.06 && signals.length < 15) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        if (conn) {
          const id = Math.random();
          setSignals(prev => [...prev, { id, start: conn.start, end: conn.end }]);
        }
    }
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color={isDark ? "#00f2ff" : "#00bcd4"}
          size={isDark ? 0.2 : 0.18}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {connections.map((c, i) => (
        <Line
          key={i}
          points={[c.start, c.end]}
          color={isDark ? "#7000ff" : "#512da8"}
          lineWidth={isDark ? 0.8 : 0.6}
          transparent
          opacity={isDark ? 0.4 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      ))}

      {signals.map(s => (
        <Signal 
          key={s.id} 
          start={s.start} 
          end={s.end} 
          isDark={isDark}
          onDone={() => setSignals(prev => prev.filter(sig => sig.id !== s.id))} 
        />
      ))}

      <Sparkles count={30} scale={15} size={2} speed={0.1} color={isDark ? "#7000ff" : "#00bcd4"} />
    </group>
  );
};

export default function NeuralNetwork() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.getAttribute('data-theme') !== 'light');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    setIsDark(document.body.getAttribute('data-theme') !== 'light');
    return () => observer.disconnect();
  }, []);

  return (
    <div className="canvas-bg">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <ambientLight intensity={isDark ? 0.6 : 0.8} />
        <Network isDark={isDark} />
      </Canvas>
    </div>
  );
}
