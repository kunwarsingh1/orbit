import {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { motion, useAnimationControls } from "framer-motion";
import { earthNodes, type EarthNode } from "@/data/earthNodes";
import { calloutRingAnchor, GLOBE_VIEW as VIEW } from "@/data/globeCalloutLayout";
import type { PhaseId } from "@/data/sourcingPhases";
import GlobeCallouts from "@/components/GlobeCallouts";
import EarthGlobeMesh from "@/components/EarthGlobeMesh";

/** Overlay / HUD viewBox center (e.g. 190 when VIEW is 380). */
const CENTER = VIEW / 2;
const R_RING_OUTER = CENTER - 5;
const R_RING_DASH = CENTER - 15;
const R_TICK_OUT = CENTER - 5;
const R_TICK_IN_MAJOR = CENTER - 10;
const R_TICK_IN_MINOR = CENTER - 6;
/** Scanner sweep arc radius (matches outer ring). */
const R_SWEEP = R_RING_OUTER;
const SWEEP_TOP = CENTER - 170;
const SWEEP_PATH_INNER_X = CENTER - 5;
const TEXT_INSET = 20;
const TEXT_TOP = 15;
const TEXT_BOTTOM = VIEW - 15;
/** Crosshair tick offsets from center. */
const CH_OUT = 18;
const CH_IN = 12;

export type ZoomOriginMode = "callout" | "globe";

function zoomScaleForViewport(viewportSize: number, reducedMotion: boolean): number {
  if (reducedMotion) return Math.min(2.75, 2.4);
  const s = viewportSize / 30;
  return Math.min(15, Math.max(7, s));
}

function waitForLayoutCommit(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export type EarthHandle = {
  nudgeRotate: () => Promise<void>;
  focusPanel: (panelIndex: number, origin?: ZoomOriginMode) => Promise<void>;
  resetCamera: () => Promise<void>;
};

export type EarthProps = {
  onFocusAnimationComplete?: (panelIndex: number) => void;
  /** When set, globe callouts for products in this phase are highlighted (e.g. green). */
  activePhase?: PhaseId | null;
};

const Earth = forwardRef<EarthHandle, EarthProps>(function Earth(
  { onFocusAnimationComplete, activePhase = null },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const [selectedNode, setSelectedNode] = useState<EarthNode>(earthNodes[0]);
  const [meshPaused, setMeshPaused] = useState(false);
  const [calloutsVisible, setCalloutsVisible] = useState(true);
  const [viewportOrigin, setViewportOrigin] = useState("50% 50%");
  const [viewportSize, setViewportSize] = useState(380);
  const [reducedMotion, setReducedMotion] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const earthDiskControls = useAnimationControls();
  const cameraControls = useAnimationControls();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setViewportSize(w);
    });
    ro.observe(el);
    const w = el.getBoundingClientRect().width;
    if (w > 0) setViewportSize(w);
    return () => ro.disconnect();
  }, []);

  const runNudgeAnimation = useCallback(async () => {
    await earthDiskControls.start({
      rotate: [0, 10, 0],
      transition: { duration: reducedMotion ? 0.2 : 0.6, ease: "easeInOut" },
    });
  }, [earthDiskControls, reducedMotion]);

  const resetCamera = useCallback(async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    try {
      setViewportOrigin("50% 50%");
      await waitForLayoutCommit();
      await cameraControls.start({
        scale: 1,
        transition: { duration: reducedMotion ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] },
      });
      await earthDiskControls.start({
        rotate: 0,
        transition: { duration: reducedMotion ? 0.15 : 0.45, ease: "easeOut" },
      });
      setMeshPaused(false);
      setCalloutsVisible(true);
    } finally {
      isAnimatingRef.current = false;
    }
  }, [cameraControls, earthDiskControls, reducedMotion]);

  const focusSequence = useCallback(
    async (panelIndex: number, origin: ZoomOriginMode = "globe") => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      const i = Math.max(0, Math.min(earthNodes.length - 1, panelIndex));
      const node = earthNodes[i];
      try {
        setSelectedNode(node);
        setMeshPaused(true);
        setCalloutsVisible(false);

        const { x: oxPx, y: oyPx } =
          origin === "callout"
            ? calloutRingAnchor(i, activePhase !== null)
            : { x: node.x, y: node.y };
        const ox = `${(oxPx / VIEW) * 100}%`;
        const oy = `${(oyPx / VIEW) * 100}%`;
        setViewportOrigin(`${ox} ${oy}`);
        await waitForLayoutCommit();

        const zoom = zoomScaleForViewport(viewportSize, reducedMotion);

        if (!reducedMotion) {
          await cameraControls.start({
            scale: 1.03,
            transition: { duration: 0.09, ease: [0.33, 0.12, 0.38, 1.15] },
          });
        }

        await cameraControls.start({
          scale: zoom,
          transition: {
            duration: reducedMotion ? 0.18 : 0.82,
            ease: [0.22, 0.88, 0.28, 1],
          },
        });

        setMeshPaused(false);
        onFocusAnimationComplete?.(i);
      } finally {
        isAnimatingRef.current = false;
      }
    },
    [activePhase, cameraControls, onFocusAnimationComplete, reducedMotion, viewportSize],
  );

  const focusPanel = useCallback(
    async (panelIndex: number, origin: ZoomOriginMode = "globe") => {
      await focusSequence(panelIndex, origin);
    },
    [focusSequence],
  );

  useImperativeHandle(
    ref,
    () => ({
      nudgeRotate: () => runNudgeAnimation(),
      focusPanel,
      resetCamera,
    }),
    [runNudgeAnimation, focusPanel, resetCamera],
  );

  const handleDotActivate = useCallback(
    (node: EarthNode) => (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if ("key" in e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
      }
      const idx = earthNodes.findIndex((n) => n.id === node.id);
      if (idx >= 0) void focusSequence(idx, "globe");
    },
    [focusSequence],
  );

  const handleCalloutClick = useCallback(
    (panelIndex: number) => {
      void focusSequence(panelIndex, "callout");
    },
    [focusSequence],
  );

  return (
    <div
      className="relative mx-auto flex h-[min(340px,min(62vw,380px))] w-[min(340px,min(62vw,380px))] items-center justify-center overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        ref={viewportRef}
        className="relative z-[5] h-[min(400px,min(72vw,440px))] w-[min(400px,min(72vw,440px))] overflow-visible"
        style={{ transformOrigin: viewportOrigin }}
        initial={{ scale: 1 }}
        animate={cameraControls}
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-visible">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
          style={{
            width: "118%",
            height: "118%",
            background: `radial-gradient(circle, hsl(var(--glow-primary) / ${hovered ? 0.35 : 0.15}) 0%, hsl(var(--glow-primary) / ${hovered ? 0.12 : 0.05}) 40%, transparent 70%)`,
            animation: reducedMotion ? undefined : "pulse-glow 4s ease-in-out infinite",
          }}
        />

        <motion.div
          className="relative z-[1] shrink-0 rounded-full overflow-hidden transition-shadow duration-500"
          style={{
            width: "min(252px, 74%)",
            height: "min(252px, 74%)",
            aspectRatio: "1",
            transformOrigin: "center center",
            boxShadow: hovered
              ? "0 0 40px hsl(var(--glow-primary) / 0.6), 0 0 80px hsl(var(--glow-primary) / 0.3), inset 0 0 30px hsl(var(--glow-primary) / 0.2)"
              : "0 0 20px hsl(var(--glow-primary) / 0.3), 0 0 60px hsl(var(--glow-primary) / 0.1), inset 0 0 20px hsl(var(--glow-primary) / 0.1)",
          }}
          animate={earthDiskControls}
          initial={{ rotate: 0 }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <svg viewBox="0 0 300 300" className="pointer-events-none absolute inset-0 z-0 h-full w-full">
              <defs>
                <radialGradient id="meshCoreGlow" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="hsl(192 55% 92% / 0.35)" />
                  <stop offset="55%" stopColor="transparent" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="300" height="300" fill="hsl(0 0% 100% / 0.97)" />
              <circle cx="150" cy="150" r="148" fill="url(#meshCoreGlow)" opacity={0.75} />
            </svg>
            <div className="absolute inset-0 z-[1] overflow-hidden rounded-full">
              <EarthGlobeMesh meshPaused={meshPaused} />
            </div>
            <svg
              viewBox="0 0 300 300"
              className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
              aria-hidden
            >
              <defs>
                <radialGradient id="earthShadingOverlay" cx="50%" cy="48%">
                  <stop offset="0%" stopColor="hsl(0 0% 100% / 0.35)" />
                  <stop offset="45%" stopColor="hsl(195 40% 98% / 0.25)" />
                  <stop offset="82%" stopColor="hsl(200 35% 94% / 0.3)" />
                  <stop offset="100%" stopColor="hsl(205 28% 90% / 0.4)" />
                </radialGradient>
              </defs>
              <circle cx="150" cy="150" r="150" fill="url(#earthShadingOverlay)" />
              <ellipse cx="150" cy="110" rx="52" ry="44" fill="hsl(0 0% 100% / 0.2)" />
            </svg>
          </div>

          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, transparent 32%, hsl(192 45% 96% / 0.5) 58%, hsl(195 40% 92% / 0.35) 85%, hsl(200 35% 88% / 0.28) 100%)",
            }}
          />

          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: "-3px",
              border: "2px solid hsl(190 85% 55% / 0.22)",
              borderRadius: "50%",
            }}
          />
        </motion.div>

        <svg className="absolute inset-0 z-[6] h-full w-full" viewBox={`0 0 ${VIEW} ${VIEW}`}>
          <defs>
            <radialGradient id="scanSweepEarth">
              <stop offset="0%" stopColor="hsl(var(--glow-primary) / 0)" />
              <stop offset="70%" stopColor="hsl(var(--glow-primary) / 0)" />
              <stop offset="100%" stopColor="hsl(var(--glow-primary) / 0.12)" />
            </radialGradient>
          </defs>

          <g className="pointer-events-none">
            <circle
              cx={CENTER}
              cy={CENTER}
              r={R_RING_OUTER}
              fill="none"
              stroke="hsl(var(--primary) / 0.12)"
              strokeWidth="0.75"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={R_RING_DASH}
              fill="none"
              stroke="hsl(var(--primary) / 0.06)"
              strokeWidth="0.4"
              strokeDasharray="3 10"
            />

            {Array.from({ length: 36 }, (_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const inner = i % 3 === 0 ? R_TICK_IN_MAJOR : R_TICK_IN_MINOR;
              const outer = R_TICK_OUT;
              return (
                <line
                  key={`tick${i}`}
                  x1={CENTER + Math.cos(angle) * inner}
                  y1={CENTER + Math.sin(angle) * inner}
                  x2={CENTER + Math.cos(angle) * outer}
                  y2={CENTER + Math.sin(angle) * outer}
                  stroke={`hsl(var(--primary) / ${i % 3 === 0 ? 0.2 : 0.08})`}
                  strokeWidth={i % 3 === 0 ? 0.75 : 0.4}
                />
              );
            })}

            <g
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                animation: reducedMotion ? undefined : "scanner-sweep 5s linear infinite",
              }}
            >
              <line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER}
                y2={SWEEP_TOP}
                stroke="hsl(var(--glow-primary) / 0.25)"
                strokeWidth="0.75"
              />
              <path
                d={`M${CENTER},${CENTER} L${SWEEP_PATH_INNER_X},${SWEEP_TOP} A${R_SWEEP},${R_SWEEP} 0 0,1 ${CENTER},${SWEEP_TOP} Z`}
                fill="hsl(var(--glow-primary) / 0.04)"
              />
            </g>
          </g>

          {earthNodes.map((pt) => (
            <g key={pt.id}>
              <circle
                className="pointer-events-none"
                cx={pt.x + 10}
                cy={pt.y+10}
                r={pt.r * 2}
                fill="none"
                stroke="hsl(var(--glow-primary) / 0.28)"
                strokeWidth="0.5"
                style={{
                  animation: reducedMotion ? undefined : `data-ping 3s ease-out ${pt.delay}s infinite`,
                }}
              />
              <circle
                role="button"
                tabIndex={0}
                aria-label={`${pt.name}: ${pt.region}. Open details.`}
                cx={pt.x}
                cy={pt.y}
                r={Math.max(pt.r * 2.2, 8)}
                fill="transparent"
                stroke="none"
                className="cursor-pointer outline-none"
                onClick={handleDotActivate(pt)}
                onKeyDown={handleDotActivate(pt)}
              />
              <circle
                className="pointer-events-none"
                cx={pt.x}
                cy={pt.y}
                r={pt.r}
                fill="hsl(var(--glow-primary))"
                style={{
                  animation: reducedMotion ? undefined : `twinkle 2s ease-in-out ${pt.delay}s infinite`,
                }}
              />
            </g>
          ))}

          <g
            className="pointer-events-none"
            fill="hsl(var(--primary) / 0.55)"
            fontFamily="var(--font-display)"
            fontSize="6"
            letterSpacing="1"
          >
            <text x={TEXT_INSET} y={TEXT_TOP}>
              {selectedNode.productTitle}
            </text>
            <text x={VIEW - TEXT_INSET} y={TEXT_TOP} textAnchor="end">
              {selectedNode.region}
            </text>
            <text x={TEXT_INSET} y={TEXT_BOTTOM}>
              {selectedNode.engagementTier}
            </text>
            <text x={VIEW - TEXT_INSET} y={TEXT_BOTTOM} textAnchor="end">
              {selectedNode.statusLabel}
            </text>
          </g>

          <g className="pointer-events-none">
            <line
              x1={CENTER}
              y1={CENTER - CH_OUT}
              x2={CENTER}
              y2={CENTER - CH_IN}
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.5"
            />
            <line
              x1={CENTER}
              y1={CENTER + CH_IN}
              x2={CENTER}
              y2={CENTER + CH_OUT}
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.5"
            />
            <line
              x1={CENTER - CH_OUT}
              y1={CENTER}
              x2={CENTER - CH_IN}
              y2={CENTER}
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.5"
            />
            <line
              x1={CENTER + CH_IN}
              y1={CENTER}
              x2={CENTER + CH_OUT}
              y2={CENTER}
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.5"
            />
          </g>
        </svg>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: "105%",
            height: "105%",
            borderColor: "hsl(var(--primary) / 0.05)",
            animation: reducedMotion ? undefined : "pulse-glow 6s ease-in-out infinite reverse",
          }}
        />

        {onFocusAnimationComplete ? (
          <GlobeCallouts
            activePhase={activePhase}
            onCalloutClick={handleCalloutClick}
            visible={calloutsVisible}
          />
        ) : null}
        </div>
      </motion.div>
    </div>
  );
});

Earth.displayName = "Earth";

export default Earth;