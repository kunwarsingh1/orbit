import { motion } from "framer-motion";
import CountUp from "./CountUp";

interface BarData {
  value: number;
  label: string;
}

interface DataPanelProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  bars: BarData[];
  color?: "primary" | "accent" | "warn";
  delay?: number;
  direction?: "left" | "right";
}

const colorMap = {
  primary: "bg-primary",
  accent: "bg-accent",
  warn: "bg-glow-warn",
};

const borderColorMap = {
  primary: "border-primary/20",
  accent: "border-accent/20",
  warn: "border-glow-warn/20",
};

const DataPanel = ({
  title,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  bars,
  color = "primary",
  delay = 0,
  direction = "left",
}: DataPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={`glass rounded-lg p-5 w-full max-w-xs cursor-default transition-shadow duration-300 hover:glow-primary ${borderColorMap[color]}`}
      style={{ animation: `float ${3 + delay}s ease-in-out infinite` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground">{title}</h3>
        <div className={`w-2 h-2 rounded-full ${colorMap[color]} animate-pulse`} />
      </div>
      <div className="text-2xl font-bold mb-4">
        <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="flex items-end gap-1 h-12">
        {bars.map((bar, i) => (
          <motion.div
            key={bar.label}
            initial={{ height: 0 }}
            animate={{ height: `${bar.value}%` }}
            transition={{ duration: 0.6, delay: delay + i * 0.08, ease: "easeOut" }}
            className={`flex-1 rounded-t-sm ${colorMap[color]} opacity-60`}
            title={bar.label}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DataPanel;
