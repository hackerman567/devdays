import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Humanoid Robot/Avatar that animates
function HologramAvatar({ isSigning, speed = 1, currentWord = '' }) {
  const headRef = useRef();
  const leftShoulderRef = useRef();
  const rightShoulderRef = useRef();
  const leftElbowRef = useRef();
  const rightElbowRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const torsoRef = useRef();

  const [blinkTimer, setBlinkTimer] = useState(0);

  // R3F Animation loop running at 60fps
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Idle Breathing Animation (always active)
    const breathe = Math.sin(time * 2) * 0.04;
    if (torsoRef.current) {
      torsoRef.current.position.y = breathe - 0.2;
    }
    if (headRef.current) {
      headRef.current.position.y = 0.55 + breathe * 0.5;
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05; // gentle head tilt
      headRef.current.rotation.x = Math.cos(time * 0.5) * 0.03;
    }

    // 2. Eye Blinking (procedural)
    if (blinkTimer > 2) {
      // Blink active
      if (leftEyeRef.current) leftEyeRef.current.scale.y = 0.1;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = 0.1;
      if (blinkTimer > 2.15) {
        setBlinkTimer(0);
      } else {
        setBlinkTimer(prev => prev + 0.016);
      }
    } else {
      if (leftEyeRef.current) leftEyeRef.current.scale.y = 1;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = 1;
      setBlinkTimer(prev => prev + 0.016);
    }

    // 3. Active Signing Animations
    if (isSigning) {
      const signSpeed = time * 8 * speed;

      // Left Arm movement
      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.z = -0.5 + Math.sin(signSpeed * 0.8) * 0.3;
        leftShoulderRef.current.rotation.x = 0.5 + Math.cos(signSpeed) * 0.4;
      }
      if (leftElbowRef.current) {
        leftElbowRef.current.rotation.y = -0.8 + Math.sin(signSpeed * 1.2) * 0.5;
        leftElbowRef.current.rotation.x = 0.4 + Math.cos(signSpeed * 0.6) * 0.3;
      }
      if (leftHandRef.current) {
        leftHandRef.current.rotation.x = Math.sin(signSpeed * 2) * 0.6;
        leftHandRef.current.rotation.y = Math.cos(signSpeed * 1.5) * 0.6;
      }

      // Right Arm movement
      if (rightShoulderRef.current) {
        rightShoulderRef.current.rotation.z = 0.5 + Math.sin(signSpeed * 0.7) * 0.3;
        rightShoulderRef.current.rotation.x = 0.5 + Math.cos(signSpeed * 0.9) * 0.4;
      }
      if (rightElbowRef.current) {
        rightElbowRef.current.rotation.y = 0.8 + Math.sin(signSpeed * 1.1) * 0.5;
        rightElbowRef.current.rotation.x = 0.4 + Math.cos(signSpeed * 0.7) * 0.3;
      }
      if (rightHandRef.current) {
        rightHandRef.current.rotation.x = Math.sin(signSpeed * 2.2) * 0.6;
        rightHandRef.current.rotation.y = Math.cos(signSpeed * 1.3) * 0.6;
      }

      // Dynamic head reaction to signing
      if (headRef.current) {
        headRef.current.rotation.y += Math.sin(signSpeed * 0.5) * 0.05;
      }
    } else {
      // 4. Return to natural idle position smoothly
      const lerpFactor = 0.1;

      const resetRotation = (ref, targetX = 0, targetY = 0, targetZ = 0) => {
        if (ref.current) {
          ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, lerpFactor);
          ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, lerpFactor);
          ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetZ, lerpFactor);
        }
      };

      // Idle pose: arms relaxed at sides
      resetRotation(leftShoulderRef, 0.2, 0, -0.6);
      resetRotation(leftElbowRef, 0.3, -0.3, 0);
      resetRotation(leftHandRef, 0, 0, 0);

      resetRotation(rightShoulderRef, 0.2, 0, 0.6);
      resetRotation(rightElbowRef, 0.3, 0.3, 0);
      resetRotation(rightHandRef, 0, 0, 0);
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Torso/Chest */}
      <mesh ref={torsoRef} castShadow>
        <cylinderGeometry args={[0.25, 0.15, 0.8, 32]} />
        <meshStandardMaterial
          color={isSigning ? '#2E1065' : '#0F172A'}
          roughness={0.4}
          metalness={0.9}
          emissive={isSigning ? '#4C1D95' : '#1E293B'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color={isSigning ? '#6D28D9' : '#1D4ED8'}
          roughness={0.2}
          metalness={0.7}
          emissive={isSigning ? '#5B21B6' : '#1E3A8A'}
          emissiveIntensity={0.6}
        />

        {/* Eyes (Left & Right) */}
        <mesh ref={leftEyeRef} position={[-0.08, 0.05, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={isSigning ? '#FCD34D' : '#60A5FA'} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.08, 0.05, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={isSigning ? '#FCD34D' : '#60A5FA'} />
        </mesh>
      </mesh>

      {/* Left Shoulder Joint */}
      <group ref={leftShoulderRef} position={[-0.35, 0.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={isSigning ? '#A78BFA' : '#60A5FA'} roughness={0.2} emissive={isSigning ? '#8B5CF6' : '#3B82F6'} emissiveIntensity={0.8} />
        </mesh>

        {/* Left Upper Arm */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial color={isSigning ? '#DDD6FE' : '#93C5FD'} roughness={0.1} emissive={isSigning ? '#C4B5FD' : '#60A5FA'} emissiveIntensity={0.9} />
        </mesh>

        {/* Left Elbow Joint */}
        <group ref={leftElbowRef} position={[0, -0.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={isSigning ? '#A78BFA' : '#60A5FA'} emissive={isSigning ? '#8B5CF6' : '#3B82F6'} emissiveIntensity={0.8} />
          </mesh>

          {/* Left Forearm */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 16]} />
            <meshStandardMaterial color={isSigning ? '#F5F3FF' : '#DBEAFE'} roughness={0.1} emissive={isSigning ? '#DDD6FE' : '#93C5FD'} emissiveIntensity={1} />
          </mesh>

          {/* Left Hand */}
          <mesh ref={leftHandRef} position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.06, 0.1, 0.06]} />
            <meshStandardMaterial
              color={isSigning ? '#FCD34D' : '#F8FAFC'}
              emissive={isSigning ? '#F59E0B' : '#94A3B8'}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </group>

      {/* Right Shoulder Joint */}
      <group ref={rightShoulderRef} position={[0.35, 0.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={isSigning ? '#A78BFA' : '#60A5FA'} roughness={0.2} emissive={isSigning ? '#8B5CF6' : '#3B82F6'} emissiveIntensity={0.8} />
        </mesh>

        {/* Right Upper Arm */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial color={isSigning ? '#DDD6FE' : '#93C5FD'} roughness={0.1} emissive={isSigning ? '#C4B5FD' : '#60A5FA'} emissiveIntensity={0.9} />
        </mesh>

        {/* Right Elbow Joint */}
        <group ref={rightElbowRef} position={[0, -0.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={isSigning ? '#A78BFA' : '#60A5FA'} emissive={isSigning ? '#8B5CF6' : '#3B82F6'} emissiveIntensity={0.8} />
          </mesh>

          {/* Right Forearm */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 16]} />
            <meshStandardMaterial color={isSigning ? '#F5F3FF' : '#DBEAFE'} roughness={0.1} emissive={isSigning ? '#DDD6FE' : '#93C5FD'} emissiveIntensity={1} />
          </mesh>

          {/* Right Hand */}
          <mesh ref={rightHandRef} position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.06, 0.1, 0.06]} />
            <meshStandardMaterial
              color={isSigning ? '#FCD34D' : '#F8FAFC'}
              emissive={isSigning ? '#F59E0B' : '#94A3B8'}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Glowing pulsing base under the avatar
function GlowBase({ isSigning }) {
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5;
      const scaleVal = 1 + Math.sin(time * 3) * (isSigning ? 0.08 : 0.03);
      ringRef.current.scale.set(scaleVal, scaleVal, 1);
    }
  });

  return (
    <group position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Neon Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.7, 0.75, 64]} />
        <meshBasicMaterial color={isSigning ? '#8B5CF6' : '#3B82F6'} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner grid-like projection */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.68, 32]} />
        <meshBasicMaterial
          color={isSigning ? '#7C3AED' : '#1D4ED8'}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function AvatarScene({ isSigning, speed = 1, currentWord = '' }) {
  return (
    <div className="w-full h-full relative">
      {/* Glowing Soft Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-1000 rounded-2xl pointer-events-none opacity-30 ${isSigning
            ? 'bg-gradient-to-t from-violet-600/10 via-purple-600/5 to-transparent'
            : 'bg-gradient-to-t from-blue-600/10 via-sky-600/5 to-transparent'
          }`}
      />

      <Canvas
        shadows
        camera={{ position: [0, 0, 2.6], fov: 50 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#070709']} />

        {/* Subtle background stars/particles */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={2} />

        {/* Ambient environment light */}
        <ambientLight intensity={1.5} />

        {/* Dynamic spotlights for neon cyber aesthetic */}
        <spotLight
          position={[2, 4, 3]}
          angle={0.5}
          penumbra={1}
          intensity={4}
          castShadow
          color={isSigning ? '#A78BFA' : '#93C5FD'}
        />
        <spotLight
          position={[-2, 1, 3]}
          angle={0.6}
          penumbra={0.5}
          intensity={3}
          color={isSigning ? '#F472B6' : '#7DD3FC'}
        />

        {/* Point light to give the avatar a nice glowing back edge */}
        <pointLight position={[0, 1, -2]} intensity={2.5} color={isSigning ? '#8B5CF6' : '#3B82F6'} />

        {/* Hologram humanoid avatar */}
        <HologramAvatar isSigning={isSigning} speed={speed} currentWord={currentWord} />

        {/* Holographic floor ring */}
        <GlowBase isSigning={isSigning} />

        {/* Camera controls for interactivity */}
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
