import { Button } from '@mui/material';

type Props = {
  learned: boolean;
  onToggle: () => void;
};

export function ToggleLearnedButton({ learned, onToggle }: Props) {
  return (
    <Button size="small" color={learned ? 'error' : 'primary'} onClick={onToggle}>
      {learned ? 'Убрать из выученных' : 'Выучено'}
    </Button>
  );
}
