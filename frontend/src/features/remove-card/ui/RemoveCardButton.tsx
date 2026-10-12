import { Button } from '@mui/material';

type Props = {
  onRemove: () => void;
};

export function RemoveCardButton({ onRemove }: Props) {
  return (
    <Button size="small" color="error" onClick={onRemove}>
      Удалить
    </Button>
  );
}
