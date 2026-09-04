import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

const BRAND = {
  primario: '#b91c1c',
  secundario: '#365314',
  acento: '#ca8a04',
};

const PASTA_SHAPES = [
  { type: 'torus', position: [-3.2, 1.4, -2], scale: 0.55, color: BRAND.primario, speed: 1.2 },
  { type: 'torus', position: [3.4, -0.6, -1.5], scale: 0.45, color: BRAND.acento, speed: 1.6 },
  { type: 'capsule', position: [-2.4, -1.8, -3], scale: 0.35, color: BRAND.secundario, speed: 1.4 },
  { type: 'capsule', position: [2.8, 2.1, -2.5], scale: 0.3, color: BRAND.primario, speed: 1.8 },
  { type: 'sphere', position: [-3.8, -0.4, -4], scale: 0.28, color: BRAND.acento, speed: 2 },
  { type: 'sphere', position: [3.6, 0.9, -3.5], scale: 0.22, color: BRAND.secundario, speed: 1.5 },
  { type: 'capsule', position: [6.8, 2.1, -2.5], scale: 0.3, color: BRAND.primario, speed: 1.8 },
  { type: 'sphere', position: [-1.8, -3.4, -4], scale: 0.28, color: BRAND.acento, speed: 2 },
  { type: 'sphere', position: [1.6, -3.9, -3.5], scale: 0.22, color: BRAND.secundario, speed: 1.5 },
];

function PastaMesh({ type, color, scale }) {
  const geometry = useMemo(() => {
    if (type === 'torus') return new THREE.TorusGeometry(1, 0.35, 16, 32);
    if (type === 'capsule') return new THREE.CapsuleGeometry(0.45, 1.2, 8, 16);
    return new THREE.SphereGeometry(1, 24, 24);
  }, [type]);

  return (
    <mesh geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color={color}
        metalness={0.35}
        roughness={0.25}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function FloatingPasta({ type, position, scale, color, speed }) {
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={0.8}>
      <group position={position}>
        <PastaMesh type={type} color={color} scale={scale} />
      </group>
    </Float>
  );
}

function Logo3D() {
  const texture = useTexture('/logo-madomi-blanco.png');
  const groupRef = useRef();

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.premultiplyAlpha = true;
    texture.needsUpdate = true;
  }, [texture]);

  const { width, height } = useMemo(() => {
    const img = texture.image;
    const aspect = img?.width && img?.height ? img.width / img.height : 2;
    const w = 5.2;
    return { width: w, height: w / aspect };
  }, [texture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.75 + Math.sin(t * 0.4) * 0.38,
      0.06,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.55 + Math.cos(t * 0.35) * 0.15,
      0.16,
    );
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.08}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function SceneContent() {
  const groupRef = useRef();
  const shapesRef = useRef();
  const { viewport } = useThree();
  const isNarrow = viewport.width < 7;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.08,
        0.03,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#fff8f0" />
      <pointLight position={[-4, 2, 3]} intensity={0.6} color={BRAND.primario} />
      <pointLight position={[4, -1, 2]} intensity={0.45} color={BRAND.acento} />

      <Sparkles count={isNarrow ? 40 : 80} scale={[14, 8, 8]} size={2} speed={0.25} opacity={0.35} color="#fff5e6" />

      <group ref={shapesRef}>
        {PASTA_SHAPES.map((shape) => (
          <FloatingPasta key={`${shape.type}-${shape.position.join(',')}`} {...shape} />
        ))}
      </group>

      <group
        ref={groupRef}
        scale={isNarrow ? 0.72 : 1}
        position={[isNarrow ? -1.2 : 1.4, isNarrow ? -1 : 0, 0]}
      >
        <Logo3D />
      </group>
    </>
  );
}

function HeroSceneFallback() {
  return (
    <div className="heroCanvasFallback" aria-hidden="true">
      <div className="heroGradient" />
      <div className="heroOrb heroOrb1" />
      <div className="heroOrb heroOrb2" />
    </div>
  );
}

export function HeroScene3D() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <HeroSceneFallback />;
  }

  return (
    <div className="heroCanvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
