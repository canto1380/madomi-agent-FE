import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
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

const GEOMETRY_DETAIL = {
  low: {
    torus: [12, 20],
    capsule: [6, 10],
    sphere: [14, 12],
  },
  medium: {
    torus: [14, 28],
    capsule: [8, 14],
    sphere: [18, 16],
  },
  high: {
    torus: [16, 32],
    capsule: [8, 16],
    sphere: [24, 24],
  },
};

/** Perfiles según ancho del viewport 3D (unidades R3F). */
function getSceneProfile(viewportWidth) {
  if (viewportWidth < 5.5) {
    return {
      tier: 'mobile',
      logoScale: 0.76,
      logoWidth: 3.6,
      logoPosition: [0, 2.85, 0],
      sparkleCount: 20,
      shapeCount: 4,
      geometryDetail: 'low',
      pointerStrength: 0.4,
      cameraZ: 10.5,
      cameraFov: 48,
    };
  }

  if (viewportWidth < 9) {
    return {
      tier: 'tablet',
      logoScale: 0.62,
      logoWidth: 4.4,
      logoPosition: [0.5, 0.2, 0],
      sparkleCount: 44,
      shapeCount: 6,
      geometryDetail: 'medium',
      pointerStrength: 0.5,
      cameraZ: 9.5,
      cameraFov: 44,
    };
  }

  return {
    tier: 'desktop',
    logoScale: 1,
    logoWidth: 4.7,
    logoPosition: [2.3, 0, 0],
    sparkleCount: 72,
    shapeCount: PASTA_SHAPES.length,
    geometryDetail: 'high',
    pointerStrength: 0.75,
    cameraZ: 9,
    cameraFov: 42,
  };
}

function useCanvasDpr() {
  const [dprMax, setDprMax] = useState(1.75);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setDprMax(1.1);
      else if (w < 768) setDprMax(1.25);
      else if (w < 1024) setDprMax(1.5);
      else setDprMax(1.75);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return dprMax;
}

function PastaMesh({ type, color, scale, detail = 'high' }) {
  const segments = GEOMETRY_DETAIL[detail] ?? GEOMETRY_DETAIL.high;

  const geometry = useMemo(() => {
    if (type === 'torus') {
      const [tubular, radial] = segments.torus;
      return new THREE.TorusGeometry(1, 0.35, tubular, radial);
    }
    if (type === 'capsule') {
      const [cap, rings] = segments.capsule;
      return new THREE.CapsuleGeometry(0.45, 1.2, cap, rings);
    }
    const [w, h] = segments.sphere;
    return new THREE.SphereGeometry(1, w, h);
  }, [type, segments]);

  return (
    <mesh geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color={color}
        metalness={0.32}
        roughness={0.28}
        emissive={color}
        emissiveIntensity={0.07}
      />
    </mesh>
  );
}

function FloatingPasta({ type, position, scale, color, speed, detail }) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.7}>
      <group position={position}>
        <PastaMesh type={type} color={color} scale={scale} detail={detail} />
      </group>
    </Float>
  );
}

function Logo3D({ logoWidth, pointerStrength }) {
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
    return { width: logoWidth, height: logoWidth / aspect };
  }, [texture, logoWidth]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const px = state.pointer.x * pointerStrength;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      px + Math.sin(t * 0.4) * 0.12,
      0.06,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * (pointerStrength * 0.7) + Math.cos(t * 0.35) * 0.08,
      0.1,
    );
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.1;
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
  const { viewport, camera } = useThree();
  const profile = useMemo(() => getSceneProfile(viewport.width), [viewport.width]);
  const visibleShapes = PASTA_SHAPES.slice(0, profile.shapeCount);

  useEffect(() => {
    camera.position.z = profile.cameraZ;
    if ('fov' in camera) {
      camera.fov = profile.cameraFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, profile.cameraFov, profile.cameraZ]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.06,
      0.03,
    );
  });

  return (
    <>
      <ambientLight intensity={0.52} color="#fff8f0" />
      <directionalLight position={[5, 8, 5]} intensity={1.05} color="#fff8f0" />
      <pointLight position={[-4, 2, 3]} intensity={0.55} color={BRAND.primario} />
      <pointLight position={[4, -1, 2]} intensity={0.4} color={BRAND.acento} />
      <pointLight position={[2.5, 2.5, 2]} intensity={0.28} color="#9ecad8" />

      <Sparkles
        count={profile.sparkleCount}
        scale={[14, 8, 8]}
        size={profile.tier === 'mobile' ? 1.8 : 2.2}
        speed={0.12}
        opacity={0.28}
        color="#fafafa"
      />

      <group>
        {visibleShapes.map((shape) => (
          <FloatingPasta
            key={`${shape.type}-${shape.position.join(',')}`}
            {...shape}
            detail={profile.geometryDetail}
          />
        ))}
      </group>

      <group
        ref={groupRef}
        scale={profile.logoScale}
        position={profile.logoPosition}
      >
        <Logo3D logoWidth={profile.logoWidth} pointerStrength={profile.pointerStrength} />
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
      <div className="heroOrb heroOrbCold" />
    </div>
  );
}

export function HeroScene3D() {
  const reducedMotion = usePrefersReducedMotion();
  const dprMax = useCanvasDpr();

  if (reducedMotion) {
    return <HeroSceneFallback />;
  }

  return (
    <div className="heroCanvas" aria-hidden="true" data-hero-canvas="active">
      <Canvas
        dpr={[1, dprMax]}
        gl={{ antialias: dprMax > 1.2, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
