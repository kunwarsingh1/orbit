import { useMemo } from "react";
import { Check, Hourglass } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  deliverableStatusFromOwner,
  getPhaseAccordionGroups,
  phaseAccordionPanelTitle,
  phaseIds,
  sourcingPhases,
  type PhaseId,
  type PhaseShowcaseStatus,
} from "@/data/sourcingPhases";

type SourcingPhaseDockProps = {
  activePhase: PhaseId | null;
  onPhaseSelect: (phase: PhaseId) => void;
  onClear: () => void;
};

function PhaseStatusPill({ status }: { status: PhaseShowcaseStatus }) {
  const cfg = {
    active: "border-emerald-400/45 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]",
    upcoming: "border-sky-400/40 bg-sky-500/10 text-sky-200",
    planned: "border-white/15 bg-white/5 text-muted-foreground",
  }[status];
  const label = status === "active" ? "ACTIVE" : status === "upcoming" ? "UPCOMING" : "PLANNED";
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-widest",
        cfg,
      )}
    >
      {label}
    </span>
  );
}

function DeliverableStatusBadge({ owner }: { owner: string }) {
  const kind = deliverableStatusFromOwner(owner);
  if (kind === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/45 bg-emerald-500/12 px-2 py-0.5 font-display text-[10px] font-medium uppercase tracking-wide text-emerald-300">
        <Check className="h-3 w-3 shrink-0" aria-hidden />
        Completed
      </span>
    );
  }
  if (kind === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/45 bg-amber-500/12 px-2 py-0.5 font-display text-[10px] font-medium uppercase tracking-wide text-amber-200">
        <Hourglass className="h-3 w-3 shrink-0" aria-hidden />
        In Progress
      </span>
    );
  }
  return (
    <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 font-display text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {owner}
    </span>
  );
}

const SourcingPhaseDock = ({ activePhase, onPhaseSelect, onClear }: SourcingPhaseDockProps) => {
  const phaseData = activePhase !== null ? sourcingPhases[activePhase] : null;

  const accordionGroups = useMemo(
    () => (phaseData ? getPhaseAccordionGroups(phaseData.id) : []),
    [phaseData],
  );

  const defaultAccordionItem = useMemo(() => {
    if (!phaseData || accordionGroups.length === 0) return undefined;
    if (phaseData.id === 1) {
      const i = accordionGroups.findIndex((g) => g.step === "Transport");
      if (i >= 0) return `item-${phaseData.id}-${i}`;
    }
    return `item-${phaseData.id}-0`;
  }, [phaseData, accordionGroups]);

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-col border-t border-primary/15 bg-background/40 backdrop-blur-sm",
        activePhase !== null && "min-h-0 flex-1",
      )}
    >
      {phaseData !== null && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Top tabs — match reference: phase + date range */}
          <div className="shrink-0 border-b border-white/10 bg-[#050a10]/80 px-3 py-3 sm:px-5">
            <div
              className="flex flex-wrap items-stretch justify-center gap-2 sm:justify-between"
              role="tablist"
              aria-label="Sourcing phases"
            >
              {phaseIds.map((id) => {
                const p = sourcingPhases[id];
                const selected = activePhase === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => onPhaseSelect(id)}
                    className={cn(
                      "flex min-w-[7.5rem] flex-col items-center rounded-lg px-3 py-2.5 font-display transition-all",
                      selected
                        ? "bg-primary/12 text-primary shadow-[0_0_28px_rgba(56,189,248,0.35)] ring-1 ring-primary/50"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide">Phase {id}</span>
                    <span className="mt-0.5 text-[10px] font-body tracking-wide text-muted-foreground">
                      {p.dateRangeShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Showcase: solid panel only — do not use a screenshot as bg behind text (it causes ghost/double labels). */}
          <div className="relative isolate min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-[#050a10] via-[#070f18] to-[#050a10]">
            <div className="relative z-10 px-3 py-4 sm:px-6">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    Phase {phaseData.id}
                  </h2>
                  <PhaseStatusPill status={phaseData.phaseStatus} />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-display text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {phaseData.progressPercent}% Complete
                  </span>
                  <div className="h-2 w-36 overflow-hidden rounded-full bg-white/10 sm:w-44">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-purple-500 transition-[width] duration-500"
                      style={{ width: `${phaseData.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="mb-4 max-w-3xl text-xs leading-relaxed text-muted-foreground font-body">
                {phaseData.summary}
              </p>

              <Accordion
                key={phaseData.id}
                type="single"
                collapsible
                defaultValue={defaultAccordionItem}
                className="space-y-2"
              >
                {accordionGroups.map((group, gIdx) => {
                  const itemId = `item-${phaseData.id}-${gIdx}`;
                  return (
                    <AccordionItem
                      key={itemId}
                      value={itemId}
                      className="overflow-hidden rounded-lg border-0 border border-white/10 bg-[#0a1219]/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    >
                      <AccordionTrigger className="px-3 py-3 hover:no-underline sm:px-4">
                        <span className="flex items-center gap-3 text-left">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--glow-primary)/0.85)]"
                            aria-hidden
                          />
                          <span className="font-display text-sm font-medium text-foreground">
                            {phaseAccordionPanelTitle(group.step)}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="border-t border-white/5 bg-black/20 px-3 pb-3 pt-0 sm:px-4">
                        <div className="divide-y divide-white/5">
                          {group.rows.map((row) => (
                            <div
                              key={row.id}
                              className="flex flex-wrap items-center justify-between gap-3 py-2.5 first:pt-3"
                            >
                              <span className="min-w-0 flex-1 text-sm text-muted-foreground font-body">
                                {row.activity}
                              </span>
                              <DeliverableStatusBadge owner={row.owner} />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-border/50 px-3 py-3 sm:px-6",
          phaseData === null ? "bg-background/25" : "bg-[#050a10]/90",
        )}
      >
        {phaseData === null && (
          <div
            className="inline-flex flex-wrap items-center justify-center gap-1 rounded-md bg-muted/80 p-1"
            role="tablist"
            aria-label="Sourcing phases"
          >
            {phaseIds.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activePhase === id}
                onClick={() => onPhaseSelect(id)}
                className={cn(
                  "rounded-sm px-3 py-1.5 font-display text-xs font-medium uppercase tracking-wide transition-all",
                  activePhase === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Phase {id}
              </button>
            ))}
          </div>
        )}
        {activePhase !== null && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline font-body"
          >
            Reset layout
          </button>
        )}
      </div>
    </div>
  );
};

export default SourcingPhaseDock;
