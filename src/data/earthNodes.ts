/**
 * Eight suite products around the globe — indices match `allDashboardPanels` and Phase 1 doc.
 * Source: `public/360 Sourcing Suite.docx`
 */
export interface EarthNode {
  id: string;
  /** Full product name. */
  name: string;
  /** Short label on the ring (project name). */
  productTitle: string;
  region: string;
  latDisplay: string;
  lonDisplay: string;
  engagementTier: string;
  statusLabel: string;
  pipelineNote: string;
  riskPosture: string;
  dataQuality: string;
  /** Legacy code / secondary tag (optional). */
  calloutCode: string;
  metricLine: string;
  x: number;
  y: number;
  r: number;
  delay: number;
}

export const earthNodes: EarthNode[] = [
  {
    id: "spend",
    name: "Spend Management",
    productTitle: "SPEND MGMT",
    region: "Suite · Spend",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "IN BUILD",
    pipelineNote: "Annual planning & budgeting (Phase 2)",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "SPEND",
    metricLine: "Spend Management",
    x: 130,
    y: 90,
    r: 3,
    delay: 0,
  },
  {
    id: "sob",
    name: "SOB allocation & forecasting",
    productTitle: "SOB",
    region: "Suite · Forecast",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "IN BUILD",
    pipelineNote: "Forecasting & allocation to supplier (Phase 2)",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "SOB",
    metricLine: "Allocation & forecasting",
    x: 250,
    y: 110,
    r: 2.5,
    delay: 0.8,
  },
  {
    id: "aicm",
    name: "Costing AICM",
    productTitle: "AICM",
    region: "Suite · Costing",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "ACTIVE",
    pipelineNote: "Wire Hireness costing done · commodity charts in progress",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "AICM",
    metricLine: "Costing & commodity charts",
    x: 230,
    y: 160,
    r: 2.5,
    delay: 0.5,
  },
  {
    id: "pricing",
    name: "Pricing Portal",
    productTitle: "PRICING",
    region: "GP · Capex · Tools",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "DONE",
    pipelineNote: "GP, RFQ, quotation, workflow (Phase 1)",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "PORTAL",
    metricLine: "General purchase · RFQ",
    x: 265,
    y: 175,
    r: 2,
    delay: 1.1,
  },
  {
    id: "transport",
    name: "Transport",
    productTitle: "TRANSPORT",
    region: "Logistics",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "ACTIVE",
    pipelineNote: "Routes & costing done · Maps in progress",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "TRANSPORT",
    metricLine: "Route · costing · maps",
    x: 280,
    y: 230,
    r: 3,
    delay: 2.2,
  },
  {
    id: "npd",
    name: "NPD",
    productTitle: "NPD",
    region: "New product development",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "IN BUILD",
    pipelineNote: "ASOS integration planned Phase 2",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "NPD",
    metricLine: "New product development",
    x: 145,
    y: 170,
    r: 2,
    delay: 1.8,
  },
  {
    id: "asos",
    name: "ASOS",
    productTitle: "ASOS",
    region: "Supplier onboarding",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "DONE",
    pipelineNote: "Vendor onboarding · ERP linkage",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "ASOS",
    metricLine: "Supplier onboarding system",
    x: 160,
    y: 280,
    r: 2,
    delay: 3,
  },
  {
    id: "esg",
    name: "ESG + EHS",
    productTitle: "ESG + EHS",
    region: "Compliance",
    latDisplay: "—",
    lonDisplay: "—",
    engagementTier: "Phase 1",
    statusLabel: "IN BUILD",
    pipelineNote: "Part of suite scope",
    riskPosture: "Suite",
    dataQuality: "Doc",
    calloutCode: "ESG",
    metricLine: "ESG + EHS",
    x: 210,
    y: 260,
    r: 2,
    delay: 2.8,
  },
];
