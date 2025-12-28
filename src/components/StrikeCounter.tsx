'use client';

interface StrikeCounterProps {
  strikes: number;
  maxStrikes: number;
}

export function StrikeCounter({ strikes, maxStrikes }: StrikeCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-70">Mistakes:</span>
      <div className="flex gap-1">
        {Array.from({ length: maxStrikes }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < strikes
                ? 'bg-[var(--color-accent)]'
                : 'bg-[var(--background-card)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
