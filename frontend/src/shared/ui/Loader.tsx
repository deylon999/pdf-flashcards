import { Box, CircularProgress, Typography } from '@mui/material';

type Props = {
  text?: string;
};

export function Loader({ text = 'Загрузка…' }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
      <CircularProgress size={24} />
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
