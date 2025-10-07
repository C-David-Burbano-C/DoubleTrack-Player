'use client';

import { cn } from '@/lib/utils';

type CircularProgressProps = {
  progress: number;
  className?: string;
};

export function CircularProgress({
  progress,
  className,
}: CircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className={cn('h-full w-full -rotate-90', className)}
      viewBox="0 0 100 100"
    >
      {/* Background circle */}
      <circle
        className="text-secondary"
        strokeWidth="5"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />
      {/* Progress circle */}
      <circle
        className="text-primary"
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
        style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
      />
    </svg>
  );
}
