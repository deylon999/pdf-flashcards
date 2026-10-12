import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

type Props = {
  title: string;
  text?: string;
};

export function NotFoundMessage({ title, text }: Props) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {text && (
        <Typography color="text.secondary" gutterBottom>
          {text}
        </Typography>
      )}
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        На главную
      </Button>
    </>
  );
}
