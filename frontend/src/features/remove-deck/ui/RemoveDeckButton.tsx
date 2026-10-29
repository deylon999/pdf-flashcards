import { ConfirmActionButton } from '@/shared/ui';

type Props = {
  title: string;
  onRemove: () => Promise<void>;
};

export function RemoveDeckButton({ title, onRemove }: Props) {
  return <ConfirmActionButton label="Удалить колоду" title="Удалить колоду?"
    description={`Колода «${title}» и все её карточки будут удалены.`} onConfirm={onRemove} />;
}
