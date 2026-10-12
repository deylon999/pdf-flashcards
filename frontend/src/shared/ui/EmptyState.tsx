import type { ReactNode } from 'react';
import { Typography, type SxProps, type Theme } from '@mui/material';

type Props = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export function EmptyState({ children, sx }: Props) {
  return (
    <Typography color="text.secondary" sx={sx}>
      {children}
    </Typography>
  );
}
