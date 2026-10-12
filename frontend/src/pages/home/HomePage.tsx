import { Typography } from '@mui/material';
import { DeckList, useDecks } from '@/entities/deck';
import { CreateDeckForm } from '@/features/create-deck';
import { ErrorMessage, Loader, ToggleSection } from '@/shared/ui';

export function HomePage() {
  const { decks, status, reload, addDeck } = useDecks();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Мои колоды
      </Typography>
      {status === 'loading' && <Loader text="Загружаем колоды…" />}
      {status === 'error' && <ErrorMessage text="Не удалось загрузить колоды" onRetry={reload} />}
      {status === 'ready' && (
        <>
          <ToggleSection openLabel="Новая колода">
            <CreateDeckForm existingTitles={decks.map(deck => deck.title)} onCreate={addDeck} />
          </ToggleSection>
          <DeckList decks={decks} />
        </>
      )}
    </>
  );
}
