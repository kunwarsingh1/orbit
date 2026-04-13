import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";
import Earth, { type EarthHandle } from "@/components/Earth";
import DataLines from "@/components/DataLines";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SourcingPhaseDock from "@/components/SourcingPhaseDock";
import { allDashboardPanels } from "@/data/dashboardPanels";
import { earthNodes } from "@/data/earthNodes";
import type { PhaseId } from "@/data/sourcingPhases";
import { cn } from "@/lib/utils";

const Index = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const earthRef = useRef<EarthHandle>(null);
  const [labelModal, setLabelModal] = useState<{ globalPanelIndex: number; labelIndex: number } | null>(null);
  const [activePhase, setActivePhase] = useState<PhaseId | null>(null);

  const handleFocusAnimationComplete = useCallback((panelIndex: number) => {
    setActivePhase(null);
    setLabelModal({ globalPanelIndex: panelIndex, labelIndex: 0 });
  }, []);

  const handleSheetOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setLabelModal(null);
      void earthRef.current?.resetCamera();
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const modalPanel = labelModal != null ? allDashboardPanels[labelModal.globalPanelIndex] : null;
  const modalLabel =
    modalPanel && labelModal != null ? modalPanel.dataLabels[labelModal.labelIndex] : null;
  const modalNode = labelModal != null ? earthNodes[labelModal.globalPanelIndex] : null;
  const modalSheetSubtitle =
    modalNode == null
      ? null
      : modalNode.productTitle === modalNode.name
        ? modalNode.name
        : `${modalNode.productTitle} · ${modalNode.name}`;
  const showModalSheetSubtitle =
    modalSheetSubtitle != null && modalSheetSubtitle !== modalPanel?.title;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      <StarField />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 md:px-12"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <h1 className="text-sm md:text-base font-display uppercase tracking-[0.3em] text-primary text-glow">
            Souricng Digital Transformation Model
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:block text-xs text-muted-foreground font-body tracking-wider">
            SOURCE-TO-CONTRACT
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-body">LIVE</span>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        {/* Hero: globe + orbiting callouts centered between header and footer */}
        <div
          className={cn(
            "relative flex min-h-0 w-full flex-1 flex-col overflow-visible px-4 py-4 md:py-6",
            activePhase === null ? "items-center justify-center" : "items-center justify-start",
          )}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <motion.div
              className="h-full w-full"
              style={{ transform: `translate(${mouse.x * 0.08}px, ${mouse.y * 0.08}px)` }}
            >
              <DataLines />
            </motion.div>
          </div>

          <motion.div
            layout
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 flex w-full max-w-[min(100%,560px)] justify-center",
              activePhase === null
                ? "shrink-0 items-center justify-center"
                : "shrink-0 items-start -mt-2 pb-8 pt-0 sm:pb-10",
            )}
          >
            <Earth
              ref={earthRef}
              activePhase={activePhase}
              onFocusAnimationComplete={handleFocusAnimationComplete}
            />
          </motion.div>
        </div>

        {/* Idle: dock overlays bottom so it does not offset vertical centering of the globe */}
        <div
          className={cn(
            "flex w-full flex-col",
            activePhase === null
              ? "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background/80 via-background/35 to-transparent pb-2 pt-12"
              : "relative z-20 min-h-0 flex-1 pt-2",
          )}
        >
          <div
            className={cn(
              activePhase === null && "pointer-events-auto mx-auto w-full max-w-4xl px-2",
            )}
          >
            <SourcingPhaseDock
              activePhase={activePhase}
              onPhaseSelect={setActivePhase}
              onClear={() => setActivePhase(null)}
            />
          </div>
        </div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="relative z-10 flex shrink-0 flex-wrap items-center justify-center gap-6 px-4 py-4 text-xs text-muted-foreground md:gap-8 font-body"
      >
        <span>PRODUCT: 360 Sourcing Suite</span>
        <span className="hidden sm:inline">WORKFLOW: Source-to-contract</span>
        <span>STATUS: Ready</span>
      </motion.footer>

      <Sheet open={labelModal !== null} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="bottom"
          overlayClassName="bg-black/12 backdrop-blur-sm"
          className="h-[min(100dvh,100%)] max-h-[100dvh] min-h-[72dvh] overflow-y-auto rounded-none border-primary/20 border-x-0 !bg-background/15 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.1)] backdrop-blur-lg sm:max-w-none"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="font-display tracking-wide pr-8 drop-shadow-sm">{modalLabel?.title}</SheetTitle>
            <SheetDescription className="font-body">
              {modalPanel?.title}
              {showModalSheetSubtitle && (
                <span className="mt-1 block text-muted-foreground/90">{modalSheetSubtitle}</span>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground font-body">{modalLabel?.body}</p>
            {modalNode && (
              <dl className="grid gap-3 border-t border-border/50 pt-4 text-sm font-body">
                <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                  <dt className="text-muted-foreground">Scope</dt>
                  <dd className="text-right text-xs">{modalNode.region}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                  <dt className="text-muted-foreground">Phase</dt>
                  <dd>{modalNode.engagementTier}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                  <dt className="text-muted-foreground">Pipeline</dt>
                  <dd>{modalNode.pipelineNote}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                  <dt className="text-muted-foreground">Risk posture</dt>
                  <dd>{modalNode.riskPosture}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Data quality</dt>
                  <dd>{modalNode.dataQuality}</dd>
                </div>
              </dl>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;