import { useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const CountUp = ({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }: CountUpProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);

  return (
    <span className="font-display text-primary text-glow">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default CountUp;
