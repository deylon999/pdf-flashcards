import type { ReactNode } from 'react';
import { Box } from '@mui/material';

type Props = {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
};

const faceSx = {
  gridArea: '1 / 1',
  backfaceVisibility: 'hidden',
} as const;

// Обе стороны лежат в одной ячейке grid, поэтому высота подстраивается под большую из них.
export function FlipCard({ flipped, front, back }: Props) {
  return (
    <Box sx={{ perspective: '1000px' }}>
      <Box
        sx={{
          display: 'grid',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: flipped ? 'rotateY(180deg)' : 'none',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <Box sx={faceSx} aria-hidden={flipped}>
          {front}
        </Box>
        <Box sx={{ ...faceSx, transform: 'rotateY(180deg)' }} aria-hidden={!flipped}>
          {back}
        </Box>
      </Box>
    </Box>
  );
}
