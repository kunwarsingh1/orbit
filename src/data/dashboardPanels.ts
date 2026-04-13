/**
 * Eight dashboard panels — one per suite product (`public/360 Sourcing Suite.docx`).
 */
export interface BarDatum {
  value: number;
  label: string;
}

export interface DataLabel {
  id: string;
  title: string;
  body: string;
}

export interface DashboardPanel {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color: "primary" | "accent" | "warn";
  bars: BarDatum[];
  dataLabels: DataLabel[];
  tabLabel: string;
}

const L = (id: string, title: string, body: string): DataLabel => ({ id, title, body });

const EVEN = (labels: string[]): BarDatum[] =>
  labels.map((label) => ({ value: 20, label }));

/** Global index 0–3 — matches globe / earthNodes order. */
export const panelsLeft: DashboardPanel[] = [
  {
    title: "Spend Management",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "primary",
    tabLabel: "Spend",
    bars: EVEN(["Plan", "Budget", "Track", "Report", "Control"]),
    dataLabels: [
      L("sm0", "Suite role", "Core product in the 360 Sourcing Suite alongside SOB, AICM, Pricing, Transport, NPD, ASOS, and ESG + EHS."),
      L("sm1", "Phase 2 — planning", "Annual planning & budgeting (May 26 – Nov 26 wave per roadmap)."),
      L("sm2", "Visibility", "Designed to give stakeholders a consolidated view of spend as the suite matures."),
      L("sm3", "Integration", "Aligned with ERP linkage work delivered under ASOS and related modules."),
      L("sm4", "Governance", "Supports approval paths consistent with workflow in the Pricing Portal."),
      L("sm5", "Reporting", "Future-friendly slot for dashboards once Phase 3 intelligence lands."),
      L("sm6", "Compliance", "Connects to ESG + EHS and supplier data for holistic reporting."),
      L("sm7", "Forecast tie-in", "Pairs with SOB allocation & forecasting for forward-looking control."),
      L("sm8", "Roadmap", "Document marks suite as actively under construction; updates surface per product."),
      L("sm9", "Status", "Follow Phase 1 / 2 tables in-app for current vs coming-soon scope."),
    ],
  },
  {
    title: "SOB allocation & forecasting",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "accent",
    tabLabel: "SOB",
    bars: EVEN(["Allocate", "Forecast", "Revise", "Publish", "Monitor"]),
    dataLabels: [
      L("so0", "Definition", "Share of business (SOB) allocation and forecasting within the suite."),
      L("so1", "Phase 2 delivery", "Forecasting & allocation to supplier called out for May 26 – Nov 26 phase."),
      L("so2", "Link to spend", "Works with Spend Management for annual planning & budgeting narrative."),
      L("so3", "Data quality", "Depends on supplier master and ASOS onboarding completeness."),
      L("so4", "Cadence", "Supports rolling re-forecast as commodity and route intelligence improves."),
      L("so5", "Stakeholders", "Finance, category, and operations aligned on one plan."),
      L("so6", "Scenarios", "Room for what-if once AICM pre-buying analytics arrives."),
      L("so7", "Audit", "Allocations traceable alongside Pricing Portal awards."),
      L("so8", "Suite context", "Listed among primary products on the 360 Sourcing Suite overview."),
      L("so9", "Next step", "Watch Phase 2 table for go-live of supplier-facing allocation flows."),
    ],
  },
  {
    title: "Costing AICM",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "warn",
    tabLabel: "AICM",
    bars: EVEN(["Cost", "Charts", "Modules", "Reports", "Analytics"]),
    dataLabels: [
      L("ai0", "Phase 1 — Wire Hireness", "Document states Wire Hireness module costing as done (Oct 25 – Apr 26)."),
      L("ai1", "Commodity charts", "Commodity live market charts marked in progress in Phase 1."),
      L("ai2", "Nine modules", "Nine additional modules flagged TBD within the Phase 1 window."),
      L("ai3", "Phase 2 depth", "Pre-buying analytics, world-wide reports, and 15 more modules planned next wave."),
      L("ai4", "Intelligence path", "Feeds Phase 3 goals for intelligent and predictive analysis."),
      L("ai5", "Integration", "Connects to Pricing Portal and Transport costing narratives."),
      L("ai6", "Data feeds", "Commodity data complements Transport route standardisation."),
      L("ai7", "Controls", "Supports should-cost and negotiation context for buyers."),
      L("ai8", "Transparency", "Charts aim to expose market movement to decision makers."),
      L("ai9", "Status", "Refer to Phase 1 table for done vs in-progress vs TBD lines."),
    ],
  },
  {
    title: "Pricing Portal",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "primary",
    tabLabel: "Pricing",
    bars: EVEN(["GP", "RFQ", "Quote", "Approve", "Auction"]),
    dataLabels: [
      L("pr0", "General purchase", "General Purchase module marked done in Phase 1."),
      L("pr1", "RFQ", "RFQ capability delivered in Phase 1."),
      L("pr2", "Quotation comparison", "Quotation comparison marked done."),
      L("pr3", "Workflow approval", "Workflow approval marked done."),
      L("pr4", "Coverage", "Suite overview references General Purchase, Capex, Tools & Die under this portal."),
      L("pr5", "Phase 2", "Capex module, Tools & Die module, and Reverse auction slated coming-soon wave."),
      L("pr6", "Linkage", "Tied to ASOS for supplier data and AICM for costing context."),
      L("pr7", "Compliance", "Supports controlled buying paths before award."),
      L("pr8", "User experience", "Designed so buyers compare quotes in one workspace."),
      L("pr9", "Status", "Phase 1 items complete per document; Phase 2 expands modalities."),
    ],
  },
];

/** Global index 4–7. */
export const panelsRight: DashboardPanel[] = [
  {
    title: "Transport",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "primary",
    tabLabel: "Transport",
    bars: EVEN(["Route", "Cost", "Maps", "Track", "Optimize"]),
    dataLabels: [
      L("tr0", "Route standardisation", "Marked done in Phase 1."),
      L("tr1", "Efficient costing", "Efficient costing module marked done."),
      L("tr2", "Google Maps", "Google Map integration in progress during Phase 1."),
      L("tr3", "Operational fit", "Supports logistics decisions tied to sourcing awards."),
      L("tr4", "Data to AICM", "Route and cost signals feed costing and analytics story."),
      L("tr5", "Visibility", "Helps compare lane options before commitment."),
      L("tr6", "Future", "Additional automation possible in later phases."),
      L("tr7", "Controls", "Aligned with compliance and insurance requirements."),
      L("tr8", "Stakeholders", "Logistics, procurement, and plants on shared numbers."),
      L("tr9", "Status", "Two modules done, maps integration still landing."),
    ],
  },
  {
    title: "NPD",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "accent",
    tabLabel: "NPD",
    bars: EVEN(["Design", "Source", "Launch", "Learn", "Iterate"]),
    dataLabels: [
      L("np0", "Scope", "New product development track inside the suite."),
      L("np1", "Phase 2 — ASOS", "Integration with ASOS explicitly listed for the May 26 – Nov 26 wave."),
      L("np2", "Collaboration", "Supplier / compliance / product team TAT & communication called out."),
      L("np3", "Speed", "Reduces hand-offs between onboarding and launch teams."),
      L("np4", "Quality", "Ensures specs and compliance travel with the product record."),
      L("np5", "Link to Pricing", "Coordinates with Pricing Portal for new buys and tooling."),
      L("np6", "Risk", "Surfaces blockers early via shared workflows."),
      L("np7", "Metrics", "Room for KPIs as suite intelligence matures."),
      L("np8", "Training", "Enables teams to follow one playbook."),
      L("np9", "Status", "Slated for Phase 2 per roadmap document."),
    ],
  },
  {
    title: "ASOS",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "warn",
    tabLabel: "ASOS",
    bars: EVEN(["Onboard", "Link", "Verify", "Evaluate", "Improve"]),
    dataLabels: [
      L("as0", "Definition", "ASOS — supplier onboarding system in the suite overview."),
      L("as1", "Vendor onboarding", "Marked done in Phase 1."),
      L("as2", "ERP linkage", "Marked done in Phase 1."),
      L("as3", "Phase 2 depth", "Doc verification through govt. portals and vendor evaluation planned."),
      L("as4", "NPD handoff", "Feeds new product development integration in Phase 2."),
      L("as5", "Risk", "Creates trusted supplier record for downstream modules."),
      L("as6", "Speed", "Reduces duplicate data entry across ERP and portals."),
      L("as7", "Compliance", "Foundation for ESG + EHS attestations."),
      L("as8", "Experience", "Suppliers self-serve with clear status."),
      L("as9", "Status", "Core onboarding done; deeper verification in next wave."),
    ],
  },
  {
    title: "ESG + EHS",
    value: 0,
    suffix: "",
    decimals: 0,
    color: "primary",
    tabLabel: "ESG",
    bars: EVEN(["Policy", "Track", "Report", "Audit", "Improve"]),
    dataLabels: [
      L("es0", "Suite placement", "Listed alongside other flagship products in the 360 Sourcing Suite document."),
      L("es1", "Environment", "ESG factors expected to align with supplier onboarding and spend data."),
      L("es2", "Health & safety", "EHS coverage for sites and suppliers."),
      L("es3", "Reporting", "Supports disclosures as programs mature."),
      L("es4", "Integration", "Pulls evidence from ASOS and operations systems."),
      L("es5", "Risk", "Highlights non-compliance before award."),
      L("es6", "Targets", "Tracks improvement goals over time."),
      L("es7", "Stakeholders", "Legal, sustainability, and procurement aligned."),
      L("es8", "Future", "Benefits from Phase 3 intelligent and predictive analysis."),
      L("es9", "Status", "Product area in active suite build; detail follows same release rhythm."),
    ],
  },
];

export const allDashboardPanels: DashboardPanel[] = [...panelsLeft, ...panelsRight];

export function globalPanelIndex(side: "left" | "right", tabIndex: number): number {
  return side === "left" ? tabIndex : tabIndex + panelsLeft.length;
}
