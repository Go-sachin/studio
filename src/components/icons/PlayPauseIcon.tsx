import React from 'react';
import { cn } from '@/lib/utils';

interface PlayPauseIconProps extends React.SVGProps<SVGSVGElement> {
  isPlaying: boolean;
}

export function PlayPauseIcon({ isPlaying, className, ...props }: PlayPauseIconProps) {
  const iconStyle = {
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
      {...props}
    >
      <g>
        <path
          d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
          style={{ ...iconStyle, opacity: isPlaying ? 1 : 0 }}
        />
        <path
          d="M8 5v14l11-7z"
          style={{ ...iconStyle, opacity: isPlaying ? 0 : 1 }}
        />
      </g>
    </svg>
  );
}
