"use client";

interface SparklineProps {
  data: number[];
  max?: number;
  className?: string;
  strokeClassName?: string;
}

export function Sparkline({ data, max = 100, className, strokeClassName }: SparklineProps) {
  if (data.length < 2) {
    return <div className={className} />;
  }

  const width = 100;
  const height = 32;
  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (Math.min(value, max) / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
    >
      <polyline
        points={points}
        fill="none"
        strokeWidth={2}
        className={strokeClassName ?? "stroke-cyan-400/80"}
      />
    </svg>
  );
}
