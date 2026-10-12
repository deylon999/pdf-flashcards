import { Alert, Button } from '@mui/material';

type Props = {
  text: string;
  onRetry?: () => void;
};

export function ErrorMessage({ text, onRetry }: Props) {
  return (
    <Alert
      severity="error"
      variant="outlined"
      sx={{ my: 2 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Повторить
          </Button>
        )
      }
    >
      {text}
    </Alert>
  );
}
