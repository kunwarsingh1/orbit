import { useMemo } from "react";
import { earthNodes } from "@/data/earthNodes";
import { getEarthNodeIdsForPhase } from "@/data/phaseEarthNodes";
import {
  GLOBE_VIEW as VIEW,
  GLOBE_CX as CX,
  GLOBE_CY as CY,
  calloutFanAngle,
  calloutFanLineOut,
  calloutFanRadius,
} from "@/data/globeCalloutLayout";
import type { PhaseId } from "@/data/sourcingPhases";
import { cn } from "@/lib/utils";

type GlobeCalloutsProps = {
  onCalloutClick: (panelIndex: number) => void;
  /** When false, callouts fade out (e.g. during focus zoom). */
  visible?: boolean;
  /** Selected roadmap phase — matching product callouts use phase highlight (green). */
  activePhase?: PhaseId | null;
};

const GlobeCallouts = ({ onCalloutClick, visible = true, activePhase = null }: GlobeCalloutsProps) => {
  const phaseTableOpen = activePhase != null;
  const phaseNodeIds = useMemo(() => {
    if (activePhase == null) return null;
    return getEarthNodeIdsForPhase(activePhase);
  }, [activePhase]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[25] flex items-center justify-center transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={false}
    >
      <div className="relative h-full w-full overflow-visible">
        <svg
          className="absolute inset-0 h-full w-full text-primary"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          fill="none"
          aria-hidden
        >
          {earthNodes.map((node, i) => {
            const angle = calloutFanAngle(i, phaseTableOpen);
            const rLine = calloutFanLineOut(i, phaseTableOpen);
            const x1 = CX + Math.cos(angle) * rLine;
            const y1 = CY + Math.sin(angle) * rLine;
            const inPhase = phaseNodeIds?.has(node.id) ?? false;
            return (
              <line
                key={`lead-${node.id}`}
                className={inPhase ? "text-emerald-500" : "text-primary"}
                x1={x1}
                y1={y1}
                x2={node.x}
                y2={node.y}
                stroke="currentColor"
                strokeOpacity={inPhase ? 0.55 : 0.45}
                strokeWidth={0.75}
              />
            );
          })}
        </svg>

        {earthNodes.map((node, i) => {
          const angle = calloutFanAngle(i, phaseTableOpen);
          const rCard = calloutFanRadius(i, phaseTableOpen);
          const leftPct = ((CX + Math.cos(angle) * rCard) / VIEW) * 100;
          const topPct = ((CY + Math.sin(angle) * rCard) / VIEW) * 100;
          const inPhase = phaseNodeIds?.has(node.id) ?? false;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onCalloutClick(i)}
              className={cn(
                "absolute box-border flex h-[3.75rem] w-[102px] min-h-[3.75rem] min-w-[102px] max-w-[102px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-0.5 rounded border px-1.5 py-1 text-left backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2",
                inPhase
                  ? "border-emerald-500/55 bg-emerald-950/35 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:border-emerald-400/65 hover:bg-emerald-950/45 focus-visible:ring-emerald-400/45"
                  : "border-primary/40 bg-background/70 shadow-[0_0_10px_hsl(var(--glow-primary)/0.22)] hover:border-primary/70 hover:bg-background/85 focus-visible:ring-primary/50",
                visible ? "pointer-events-auto" : "pointer-events-none",
              )}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <p
                className={cn(
                  "line-clamp-2 min-h-[1.375rem] font-display text-[8px] font-semibold uppercase leading-tight tracking-wide",
                  inPhase ? "text-emerald-200" : "text-primary",
                )}
              >
                {node.productTitle}
              </p>
              <p
                className={cn(
                  "line-clamp-2 min-h-[1.125rem] font-mono text-[7px] leading-tight",
                  inPhase ? "text-emerald-300/85" : "text-muted-foreground",
                )}
              >
                {node.metricLine}
              </p>
              <p
                className={cn(
                  "flex min-h-[0.8125rem] items-center gap-1 font-display text-[7px] uppercase leading-none tracking-wider",
                  inPhase ? "text-emerald-200" : "text-primary",
                )}
              >
                <span
                  className={cn(
                    "h-1 w-1 shrink-0 rounded-full",
                    inPhase
                      ? "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.85)]"
                      : "bg-primary shadow-[0_0_5px_hsl(var(--glow-primary)/0.85)]",
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{node.statusLabel}</span>
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GlobeCallouts;
