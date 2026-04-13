/**
 * Roadmap from `public/360 Sourcing Suite.docx` (extract: `npm run extract:sourcing-doc`).
 */
export type PhaseId = 1 | 2 | 3;

export type SourcingPhaseRow = {
  id: string;
  /** Product / workstream (column 1). */
  step: string;
  /** Deliverable or module (column 2). */
  activity: string;
  /** Status (column 3). */
  owner: string;
  /** Notes or phase window (column 4). */
  timeline: string;
};

export type PhaseShowcaseStatus = "active" | "upcoming" | "planned";

export type SourcingPhase = {
  id: PhaseId;
  title: string;
  summary: string;
  /** Tab subtitle, e.g. "Oct 2025 – Apr 2026" */
  dateRangeShort: string;
  /** 0–100 for roadmap progress bar */
  progressPercent: number;
  phaseStatus: PhaseShowcaseStatus;
  rows: SourcingPhaseRow[];
};

export const SOURCING_PHASE_TABLE_HEADERS = ["Product / area", "Deliverable", "Status", "Notes"] as const;

/** Sort then merge step column so repeated products appear as one grouped block in the UI. */
export function groupPhaseRowsForTable(rows: SourcingPhaseRow[]) {
  const sorted = [...rows].sort((a, b) =>
    a.step.localeCompare(b.step, undefined, { sensitivity: "base" }),
  );
  const result: { row: SourcingPhaseRow; stepRowSpan: number; showStepCell: boolean }[] = [];
  let i = 0;
  while (i < sorted.length) {
    const step = sorted[i].step;
    let count = 1;
    while (i + count < sorted.length && sorted[i + count].step === step) count++;
    for (let k = 0; k < count; k++) {
      result.push({
        row: sorted[i + k],
        stepRowSpan: count,
        showStepCell: k === 0,
      });
    }
    i += count;
  }
  return result;
}

export type PhaseAccordionGroup = {
  step: string;
  rows: SourcingPhaseRow[];
};

/** One accordion panel per product / area, rows in stable sorted order. */
export function getPhaseAccordionGroups(phaseId: PhaseId): PhaseAccordionGroup[] {
  const rows = sourcingPhases[phaseId].rows;
  const sorted = [...rows].sort((a, b) =>
    a.step.localeCompare(b.step, undefined, { sensitivity: "base" }),
  );
  const order: string[] = [];
  const byStep = new Map<string, SourcingPhaseRow[]>();
  for (const r of sorted) {
    if (!byStep.has(r.step)) {
      order.push(r.step);
      byStep.set(r.step, []);
    }
    byStep.get(r.step)!.push(r);
  }
  return order.map((step) => ({ step, rows: byStep.get(step)! }));
}

/** Display title for accordion (matches roadmap naming). */
export function phaseAccordionPanelTitle(step: string): string {
  const map: Record<string, string> = {
    ASOS: "ASOS (Supplier Onboarding System)",
    "Pricing Portal": "Pricing Portal",
    "AICM — Costing": "AICM – Cost Intelligence",
    Transport: "Transport Optimization",
    "Spend Management": "Spend Management",
    "Supplier Forcasting Management": "Supplier Forcasting Management",
    NPD: "NPD",
    "ESG + EHS": "ESG + EHS",
    "Suite-wide": "Suite-wide",
    Intelligence: "Intelligence",
  };
  return map[step] ?? step;
}

export type DeliverableStatusKind = "completed" | "in_progress" | "planned" | "tbd" | "other";

export function deliverableStatusFromOwner(owner: string): DeliverableStatusKind {
  const o = owner.toLowerCase();
  if (o.includes("done") || o === "completed") return "completed";
  if (o.includes("progress")) return "in_progress";
  if (o.includes("tbd")) return "tbd";
  if (o.includes("planned")) return "planned";
  return "other";
}

export const sourcingPhases: Record<PhaseId, SourcingPhase> = {
  1: {
    id: 1,
    title: "Phase 1 — Oct 25 – Apr 26 (Going on)",
    summary:
      "Current build wave for the 360 Sourcing Suite. Products include Spend Management, SOB allocation & forecasting, Costing AICM, Pricing Portal, Transport, NPD, ASOS (supplier onboarding), and ESG + EHS. Click a product on the globe for its detail sheet.",
    dateRangeShort: "Oct 2025 – Apr 2026",
    progressPercent: 75,
    phaseStatus: "active",
    rows: [
      {
        id: "p1-asos-1",
        step: "ASOS",
        activity: "Vendor onboarding",
        owner: "Done",
        timeline: "Supplier onboarding system",
      },
      {
        id: "p1-asos-2",
        step: "ASOS",
        activity: "ERP linkage",
        owner: "Done",
        timeline: "—",
      },
      {
        id: "p1-pp-1",
        step: "Pricing Portal",
        activity: "General purchase module",
        owner: "Done",
        timeline: "GP, Capex, Tools & Die (suite scope)",
      },
      {
        id: "p1-pp-2",
        step: "Pricing Portal",
        activity: "RFQ",
        owner: "Done",
        timeline: "—",
      },
      {
        id: "p1-pp-3",
        step: "Pricing Portal",
        activity: "Quotation comparison",
        owner: "Done",
        timeline: "—",
      },
      {
        id: "p1-pp-4",
        step: "Pricing Portal",
        activity: "Workflow approval",
        owner: "Done",
        timeline: "—",
      },
      {
        id: "p1-aicm-1",
        step: "AICM — Costing",
        activity: "Wire Hireness module costing",
        owner: "Done",
        timeline: "Per document naming",
      },
      {
        id: "p1-aicm-2",
        step: "AICM — Costing",
        activity: "Commodity live market charts",
        owner: "In progress",
        timeline: "—",
      },
      {
        id: "p1-aicm-3",
        step: "AICM — Costing",
        activity: "Additional modules",
        owner: "TBD",
        timeline: "9 modules planned",
      },
      {
        id: "p1-tr-1",
        step: "Transport",
        activity: "Route standardisation",
        owner: "Done",
        timeline: "—",
      },
      {
        id: "p1-tr-2",
        step: "Transport",
        activity: "Efficient costing module",
        owner: "Done",
        timeline: "—",
      },
      {
        id: "p1-tr-3",
        step: "Transport",
        activity: "Google Map integration",
        owner: "In progress",
        timeline: "—",
      },
      // {
      //   id: "p1-suite",
      //   step: "Suite",
      //   activity: "Spend Management · SOB · NPD · ESG + EHS",
      //   owner: "In build",
      //   timeline: "Updates via product tiles / globe",
      // },
    ],
  },
  2: {
    id: 2,
    title: "Phase 2 — May 26 – Nov 26 (Coming soon)",
    summary:
      "Next wave: deeper AICM, NPD and ASOS capabilities, spend and SOB planning, expanded Pricing Portal modules, and ESG + EHS reporting and compliance depth.",
    dateRangeShort: "May 2026 – Nov 2026",
    progressPercent: 12,
    phaseStatus: "upcoming",
    rows: [
      {
        id: "p2-aicm-1",
        step: "AICM — Costing",
        activity: "Pre-buying analytics",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-aicm-2",
        step: "AICM — Costing",
        activity: "World-wide reports",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-aicm-3",
        step: "AICM — Costing",
        activity: "Additional modules",
        owner: "Planned",
        timeline: "15 more modules",
      },
      {
        id: "p2-npd-1",
        step: "NPD",
        activity: "Integration with ASOS",
        owner: "Planned",
        timeline: "New product development",
      },
      {
        id: "p2-npd-2",
        step: "NPD",
        activity: "Supplier / compliance / product team TAT & communication",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-sm-1",
        step: "Spend Management",
        activity: "Annual planning & budgeting",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-sob-1",
        step: "SOB allocation & forecasting",
        activity: "Forecasting & allocation to supplier",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-asos-1",
        step: "ASOS",
        activity: "Doc verification through govt. portals",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-asos-2",
        step: "ASOS",
        activity: "Vendor evaluation",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-pp-1",
        step: "Pricing Portal",
        activity: "Capex module",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-pp-2",
        step: "Pricing Portal",
        activity: "Tools & Die module",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-pp-3",
        step: "Pricing Portal",
        activity: "Reverse auction",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-esg-1",
        step: "ESG + EHS",
        activity: "Reporting & disclosure workflow",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p2-esg-2",
        step: "ESG + EHS",
        activity: "EHS site and supplier compliance",
        owner: "Planned",
        timeline: "—",
      },
    ],
  },
  3: {
    id: 3,
    title: "Phase 3 — Dec 26 – Jun 27 (Coming soon)",
    summary:
      "Intelligence layer across the suite: analysis, prediction, and smarter automation across all products.",
    dateRangeShort: "Dec 2026 – Jun 2027",
    progressPercent: 0,
    phaseStatus: "planned",
    rows: [
      {
        id: "p3-1",
        step: "Suite-wide",
        activity: "Make all products intelligent",
        owner: "Planned",
        timeline: "Vision",
      },
      {
        id: "p3-2",
        step: "Intelligence",
        activity: "Intelligent analysis",
        owner: "Planned",
        timeline: "—",
      },
      {
        id: "p3-3",
        step: "Intelligence",
        activity: "Predictive analysis",
        owner: "Planned",
        timeline: "—",
      },
    ],
  },
};

export const phaseIds: PhaseId[] = [1, 2, 3];
