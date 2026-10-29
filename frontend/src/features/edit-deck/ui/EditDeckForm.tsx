import { DeckForm, type Deck } from '@/entities/deck';

type Props = {
  deck: Deck;
  existingTitles: string[];
  onSave: (title: string, description: string) => Promise<void>;
};

export function EditDeckForm({ deck, existingTitles, onSave }: Props) {
  return <DeckForm key={deck.id} initialValues={deck} existingTitles={existingTitles}
    onSave={onSave} submitLabel="Сохранить" />;
}
