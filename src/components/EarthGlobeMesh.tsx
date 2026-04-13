import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Instances, Instance, PerspectiveCamera, useTexture } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const LOGO_URL = "/unnamed.png";

const PRIMARY = "#5cd8e8";

/** Same visibility rule as the legacy SVG orthographic projection. */
function spherePoint(latDeg: number, lonDeg: number): { x: number; y: number; z: number } | null {
  const φ = (latDeg * Math.PI) / 180;
  const λ = (lonDeg * Math.PI) / 180;
  const z = Math.cos(φ) * Math.cos(λ);
  if (z < -0.28) return null;
  const x = Math.cos(φ) * Math.sin(λ);
  const y = Math.sin(φ);
  return { x, y, z };
}

function useMeshPoints() {
  return useMemo(() => {
    const out: { x: number; y: number; z: number; r: number; o: number }[] = [];
    for (let lat = -85; lat <= 85; lat += 5) {
      const lonStep = Math.abs(lat) < 28 ? 6 : 10;
      for (let lon = -180; lon < 180; lon += lonStep) {
        const p = spherePoint(lat, lon);
        if (!p) continue;
        const t = Math.abs(lat) / 85;
        const r = 0.5 + (1 - t) * 0.55;
        const o = 0.32 + (1 - t) * 0.55;
        out.push({ ...p, r, o });
      }
    }
    return out;
  }, []);
}

function PointField({ points }: { points: ReturnType<typeof useMeshPoints> }) {
  const limit = Math.max(points.length, 1);
  return (
    <Instances limit={limit} range={limit}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={PRIMARY} transparent opacity={0.5} depthWrite={false} />
      {points.map((p, i) => (
        <Instance key={i} position={[p.x, p.y, p.z]} scale={p.r * 0.018} />
      ))}
    </Instances>
  );
}

/** Spin in Three.js so the canvas stays fixed; avoids CSS rotate + wrong transform-origin drifting the mesh vs the outer ring. */
function GlobeMeshes({ meshPaused, points }: { meshPaused: boolean; points: ReturnType<typeof useMeshPoints> }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (meshPaused || !groupRef.current) return;
    groupRef.current.rotation.y += ((Math.PI * 2) / 200) * delta;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 48]} />
        <meshBasicMaterial color="#151d28" transparent opacity={0.88} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 48, 32]} />
        <meshBasicMaterial color={PRIMARY} wireframe transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <PointField points={points} />
    </group>
  );
}

/** Center logo on the front of the globe; outside the rotating group so it stays upright and readable. */
function GlobeLogo() {
  const texture = useTexture(LOGO_URL);
  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  const { planeW, planeH } = useMemo(() => {
    const img = texture.image as HTMLImageElement | undefined;
    const iw = img?.width ?? 400;
    const ih = img?.height ?? 100;
    const aspect = iw / ih;
    const planeW = 0.66;
    return { planeW, planeH: planeW / aspect };
  }, [texture]);

  return (
    <Billboard position={[0, 0, 1.018]} follow>
      <mesh renderOrder={5}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
}

function GlobeScene({ meshPaused }: { meshPaused: boolean }) {
  const points = useMeshPoints();

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2.85]} fov={36} near={0.1} far={100} />
      <ambientLight intensity={1} />
      <GlobeMeshes meshPaused={meshPaused} points={points} />
      <GlobeLogo />
    </>
  );
}

/**
 * Perspective camera keeps the sphere projection centered when the canvas is square.
 * Rotation runs inside WebGL, not via CSS on the canvas wrapper.
 */
export default function EarthGlobeMesh({ meshPaused = false }: { meshPaused?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden rounded-full">
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Suspense fallback={null}>
          <GlobeScene meshPaused={meshPaused} />
        </Suspense>
      </Canvas>
    </div>
  );
}
