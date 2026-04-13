import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";
import Earth from "@/components/Earth";
import DataPanel from "@/components/DataPanel";
import DataLines from "@/components/DataLines";

const panelsLeft = [
  {
    title: "Global Traffic",
    value: 2847592,
    suffix: "",
    decimals: 0,
    color: "primary" as const,
    bars: [
      { value: 60, label: "Mon" },
      { value: 80, label: "Tue" },
      { value: 45, label: "Wed" },
      { value: 90, label: "Thu" },
      { value: 70, label: "Fri" },
      { value: 55, label: "Sat" },
      { value: 85, label: "Sun" },
    ],
  },
  {
    title: "Energy Usage",
    value: 94.7,
    suffix: " MW",
    decimals: 1,
    color: "accent" as const,
    bars: [
      { value: 70, label: "Solar" },
      { value: 90, label: "Wind" },
      { value: 40, label: "Hydro" },
      { value: 60, label: "Nuclear" },
      { value: 30, label: "Gas" },
    ],
  },
  {
    title: "Security Alerts",
    value: 12,
    suffix: "",
    decimals: 0,
    color: "warn" as const,
    bars: [
      { value: 20, label: "Low" },
      { value: 50, label: "Med" },
      { value: 90, label: "High" },
      { value: 30, label: "Crit" },
    ],
  },
];

const panelsRight = [
  {
    title: "Data Throughput",
    value: 1.42,
    suffix: " TB/s",
    decimals: 2,
    color: "primary" as const,
    bars: [
      { value: 85, label: "US" },
      { value: 70, label: "EU" },
      { value: 60, label: "APAC" },
      { value: 45, label: "SA" },
      { value: 30, label: "AF" },
    ],
  },
  {
    title: "Active Nodes",
    value: 18432,
    suffix: "",
    decimals: 0,
    color: "accent" as const,
    bars: [
      { value: 95, label: "Online" },
      { value: 5, label: "Maint" },
      { value: 2, label: "Error" },
    ],
  },
  {
    title: "Threat Level",
    value: 3,
    prefix: "Level ",
    suffix: "",
    decimals: 0,
    color: "warn" as const,
    bars: [
      { value: 10, label: "1" },
      { value: 25, label: "2" },
      { value: 60, label: "3" },
      { value: 40, label: "4" },
      { value: 15, label: "5" },
    ],
  },
];

const Index = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <StarField />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <h1 className="text-sm md:text-base font-display uppercase tracking-[0.3em] text-primary text-glow">
            Nexus
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:block text-xs text-muted-foreground font-body tracking-wider">
            GLOBAL INTELLIGENCE NETWORK
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-body">LIVE</span>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] gap-8 px-4 md:px-8">
        {/* Left panels */}
        <div
          className="flex flex-row lg:flex-col gap-4 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
          style={{ transform: `translate(${mouse.x * -0.3}px, ${mouse.y * -0.3}px)` }}
        >
          {panelsLeft.map((panel, i) => (
            <DataPanel
              key={panel.title}
              {...panel}
              delay={0.2 + i * 0.15}
              direction="left"
            />
          ))}
        </div>

        {/* Center - Earth */}
        <div
          className="relative flex-shrink-0"
          style={{ transform: `translate(${mouse.x * 0.2}px, ${mouse.y * 0.2}px)` }}
        >
          <DataLines />
          <Earth />
        </div>

        {/* Right panels */}
        <div
          className="flex flex-row lg:flex-col gap-4 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
          style={{ transform: `translate(${mouse.x * -0.3}px, ${mouse.y * -0.3}px)` }}
        >
          {panelsRight.map((panel, i) => (
            <DataPanel
              key={panel.title}
              {...panel}
              delay={0.3 + i * 0.15}
              direction="right"
            />
          ))}
        </div>
      </div>

      {/* Bottom status bar */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="relative z-10 flex items-center justify-center gap-8 py-4 text-xs text-muted-foreground font-body"
      >
        <span>UPTIME: 99.97%</span>
        <span className="hidden md:inline">LATENCY: 12ms</span>
        <span className="hidden md:inline">NODES: 18,432</span>
        <span>STATUS: OPERATIONAL</span>
      </motion.footer>
    </div>
  );
};

export default Index;
