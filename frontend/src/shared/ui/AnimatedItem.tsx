import type { ReactNode } from 'react';
import { Collapse, Grow } from '@mui/material';

type Props = {
  children: ReactNode;
  leaving?: boolean;
  onLeft?: () => void;
};

// Элемент списка: плавно появляется при добавлении и сворачивается перед удалением.
export function AnimatedItem({ children, leaving = false, onLeft }: Props) {
  return (
    <Collapse in={!leaving} onExited={onLeft}>
      <Grow in appear>
        <div>{children}</div>
      </Grow>
    </Collapse>
  );
}
