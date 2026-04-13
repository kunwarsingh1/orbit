import type { PhaseId } from "@/data/sourcingPhases";
import { sourcingPhases } from "@/data/sourcingPhases";

/**
 * Map a phase table `step` value to a globe `earthNodes` id.
 * Returns null when the row is not tied to a single product tile (e.g. Suite-wide, Intelligence).
 */
export function earthNodeIdFromPhaseStep(step: string): string | null {
  const s = step.trim();
  if (s.startsWith("AICM")) return "aicm";
  if (s.startsWith("ASOS")) return "asos";
  if (s.startsWith("Pricing Portal")) return "pricing";
  if (s.startsWith("Transport")) return "transport";
  if (s.startsWith("Spend Management")) return "spend";
  if (s.startsWith("SOB")) return "sob";
  if (s.startsWith("NPD")) return "npd";
  if (s.startsWith("ESG")) return "esg";
  return null;
}

/** Unique globe node ids that appear in that phase’s roadmap table (from `rows[].step`). */
export function getEarthNodeIdsForPhase(phase: PhaseId): Set<string> {
  const set = new Set<string>();
  for (const row of sourcingPhases[phase].rows) {
    const id = earthNodeIdFromPhaseStep(row.step);
    if (id) set.add(id);
  }
  return set;
}

export function isEarthNodeInPhase(nodeId: string, phase: PhaseId | null): boolean {
  if (phase == null) return false;
  return getEarthNodeIdsForPhase(phase).has(nodeId);
}
