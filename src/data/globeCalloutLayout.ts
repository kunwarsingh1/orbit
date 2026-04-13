/** Shared 380×380 HUD space for globe overlay and orbiting callouts (must stay in sync). */
export const GLOBE_VIEW = 380;
export const GLOBE_CX = 190;
export const GLOBE_CY = 190;
/** Orbiting callout count (matches `earthNodes` / dashboard globe indices). */
export const GLOBE_CALLOUT_COUNT = 8;
/**
 * Base ring radius for callout card centers (logical px in `GLOBE_VIEW` space).
 * Keep CY ± R + half-card ≤ view edge so labels are not clipped.
 */
/** Card centers sit on this radius; larger = labels farther out, longer leaders. */
export const GLOBE_R_CARD = 168;
/** Legacy constant; line start uses per-index fan radius − offset. */
export const GLOBE_R_LINE_OUT = 153;

function clampIndex(panelIndex: number): number {
  return Math.max(0, Math.min(GLOBE_CALLOUT_COUNT - 1, panelIndex));
}

/** Small sinusoidal spread so adjacent labels fan slightly instead of a perfect octagon. */
const FAN_ANGLE_SPREAD = 0.145;
/** When the phase table is open, rotate the ring CCW so bottom callouts sit higher / more to the sides. */
const PHASE_TABLE_ANGLE_SHIFT = 0.22;
/** Pull ring slightly inward when the table is open so labels stay above the panel. */
const PHASE_TABLE_RADIUS_INSET = 10;
/** Alternating in/out radius (px in viewBox space) for fan-out depth. */
const FAN_RADIUS_STAGGER = 7;

/**
 * Angle for callout `panelIndex`, with fan spread and optional phase-table avoidance.
 */
export function calloutFanAngle(panelIndex: number, phaseTableOpen = false): number {
  const i = clampIndex(panelIndex);
  const base = (i * 2 * Math.PI) / GLOBE_CALLOUT_COUNT - Math.PI / 2;
  const spread = FAN_ANGLE_SPREAD * Math.sin((i * Math.PI) / 4 + 0.35);
  const shift = phaseTableOpen ? PHASE_TABLE_ANGLE_SHIFT : 0;
  return base + spread + shift;
}

/**
 * Radius to place callout center — staggered for fan-out; tighter when phase table is open.
 */
export function calloutFanRadius(panelIndex: number, phaseTableOpen = false): number {
  const i = clampIndex(panelIndex);
  const stagger = (i % 2 === 0 ? 1 : -1) * FAN_RADIUS_STAGGER;
  let r = GLOBE_R_CARD + stagger;
  if (phaseTableOpen) {
    r = Math.max(132, r - PHASE_TABLE_RADIUS_INSET);
  }
  return r;
}

/** Pixels inward from card radius along the ray — larger = line starts closer to globe = longer leaders. */
const LINE_INSET_FROM_CARD = 15;

/** Line anchor slightly inside the card ring toward the globe. */
export function calloutFanLineOut(panelIndex: number, phaseTableOpen = false): number {
  return Math.max(122, calloutFanRadius(panelIndex, phaseTableOpen) - LINE_INSET_FROM_CARD);
}

/** @deprecated Use `calloutFanAngle(i, false)` — kept for any external imports */
export function calloutRingAngle(panelIndex: number): number {
  return calloutFanAngle(panelIndex, false);
}

/** Anchor on the callout ring for panel index `i` (same geometry as GlobeCallouts). */
export function calloutRingAnchor(
  panelIndex: number,
  phaseTableOpen = false,
): { x: number; y: number } {
  const angle = calloutFanAngle(panelIndex, phaseTableOpen);
  const r = calloutFanRadius(panelIndex, phaseTableOpen);
  return {
    x: GLOBE_CX + Math.cos(angle) * r,
    y: GLOBE_CY + Math.sin(angle) * r,
  };
}
