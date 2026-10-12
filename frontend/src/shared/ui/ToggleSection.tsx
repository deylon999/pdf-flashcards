import { useState, type ReactNode } from 'react';
import { Box, Button, Collapse } from '@mui/material';

type Props = {
  openLabel: string;
  children: ReactNode;
};

// Кнопка, которая плавно раскрывает и скрывает содержимое, например форму.
export function ToggleSection({ openLabel, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Button variant={open ? 'text' : 'outlined'} onClick={() => setOpen(!open)} sx={{ mb: open ? 2 : 0 }}>
        {open ? 'Скрыть' : openLabel}
      </Button>
      <Collapse in={open} unmountOnExit>
        {children}
      </Collapse>
    </Box>
  );
}
