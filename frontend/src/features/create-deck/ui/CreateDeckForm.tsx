import { DeckForm } from '@/entities/deck';

type Props = {
  existingTitles: string[];
  onCreate: (title: string, description: string) => Promise<void>;
};

export function CreateDeckForm({ existingTitles, onCreate }: Props) {
  return <DeckForm existingTitles={existingTitles} onSave={onCreate} resetAfterSave />;
}
