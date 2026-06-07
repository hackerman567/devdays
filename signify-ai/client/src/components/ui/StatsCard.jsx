import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function StatsCard({ icon: Icon, label, value, suffix = '', duration = 1.5 }) {
  const { reduceMotion } = useSettingsStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // If it's not a numeric value, or if motion reduction is enabled, set directly
    const parsedValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(parsedValue) || reduceMotion) {
      setCount(value);
      return;
    }

    const isFloat = String(value).includes('.');
    let startTimestamp = null;
    const startValue = 0;
    const endValue = parsedValue;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Quad ease-out progress curve
      const easeOutQuad = progress * (2 - progress);
      const currentVal = startValue + easeOutQuad * (endValue - startValue);

      if (isFloat) {
        setCount(Number(currentVal.toFixed(1)));
      } else {
        setCount(Math.floor(currentVal));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure exact target is set at end
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration, reduceMotion]);

  // Format the count with commas if it is a number
  const displayValue = typeof count === 'number' ? count.toLocaleString() : count;

  return (
    <div className="glass-panel glass-card-hover p-6 rounded-xl flex items-center gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-coral/5 rounded-full blur-2xl pointer-events-none" />
      {Icon && (
        <div className="p-3 bg-accent-coral/10 text-accent-coral rounded-lg border border-accent-coral/20">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <p className="text-text-secondary text-[10px] font-semibold tracking-wider uppercase">{label}</p>
        <h3 className="text-2xl font-bold font-display text-text-primary mt-1">
          {displayValue}{suffix}
        </h3>
      </div>
    </div>
  );
}
