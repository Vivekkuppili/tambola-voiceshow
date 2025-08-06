import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';

interface NumberBallProps {
  number: number;
  isActive: boolean;
  position: [number, number, number];
}

const NumberBall: React.FC<NumberBallProps> = ({ number, isActive, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1.5, 1.5, 1.5]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={isActive ? "#FFD700" : "#8B4513"}
          metalness={0.3}
          roughness={0.2}
          emissive={isActive ? "#FFB347" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Box>
      <Text
        position={[0, 0, 0.8]}
        fontSize={0.6}
        color={isActive ? "#000000" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
      >
        {number.toString()}
      </Text>
    </group>
  );
};

interface NumberPicker3DProps {
  currentNumber: number | null;
  onPickNumber: () => void;
  isPickingEnabled: boolean;
  calledNumbers: Set<number>;
}

export const NumberPicker3D: React.FC<NumberPicker3DProps> = ({
  currentNumber,
  onPickNumber,
  isPickingEnabled,
  calledNumbers
}) => {
  const [rotationSpeed, setRotationSpeed] = useState(0);

  useEffect(() => {
    if (currentNumber) {
      setRotationSpeed(0.1);
      const timer = setTimeout(() => setRotationSpeed(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentNumber]);

  return (
    <div className="relative">
      <div className="h-96 w-full bg-gradient-to-br from-muted/20 to-background rounded-lg overflow-hidden border border-border">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6B35" />
          
          <Scene 
            currentNumber={currentNumber} 
            rotationSpeed={rotationSpeed}
            calledNumbers={calledNumbers}
          />
        </Canvas>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {currentNumber && (
          <div className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg shadow-golden animate-number-reveal text-4xl font-bold">
            {currentNumber}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={onPickNumber}
          disabled={!isPickingEnabled}
          className={cn(
            "bg-gradient-primary text-primary-foreground px-8 py-3 rounded-lg",
            "font-semibold shadow-golden transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:scale-105 hover:shadow-glow active:scale-95"
          )}
        >
          {isPickingEnabled ? "Pick Number" : "Game Complete"}
        </button>
      </div>
    </div>
  );
};

const Scene: React.FC<{ 
  currentNumber: number | null; 
  rotationSpeed: number;
  calledNumbers: Set<number>;
}> = ({ currentNumber, rotationSpeed, calledNumbers }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  // Create a sphere of numbers around the current number
  const sphereNumbers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 2;
    
    const number = Math.floor(Math.random() * 90) + 1;
    return { number, position: [x, y, z] as [number, number, number] };
  });

  return (
    <group ref={groupRef}>
      {sphereNumbers.map((item, index) => (
        <NumberBall
          key={index}
          number={item.number}
          isActive={item.number === currentNumber}
          position={item.position}
        />
      ))}
    </group>
  );
};

// Helper import for cn function
import { cn } from '@/lib/utils';