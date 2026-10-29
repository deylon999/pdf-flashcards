import { ConfirmActionButton } from '@/shared/ui';

type Props = {
  onRemove: () => Promise<void>;
};

export function RemoveCardButton({ onRemove }: Props) {
  return <ConfirmActionButton label="Удалить" title="Удалить карточку?"
    description="Карточка будет удалена из колоды и статистики." onConfirm={onRemove} />;
}
