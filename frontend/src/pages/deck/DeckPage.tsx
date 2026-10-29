import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useDecks } from '@/entities/deck';
import { CardView } from '@/entities/card';
import { CardForm } from '@/features/add-card';
import { EditDeckForm } from '@/features/edit-deck';
import { RemoveDeckButton } from '@/features/remove-deck';
import { EditCardButton } from '@/features/edit-card';
import { Trainer } from '@/features/train-deck';
import { ToggleLearnedButton } from '@/features/toggle-learned';
import { RemoveCardButton } from '@/features/remove-card';
import { AnimatedItem, EmptyState, ErrorMessage, Loader, NotFoundMessage, ToggleSection } from '@/shared/ui';

export function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { decks, status, error, reload, updateDeck, removeDeck, addCard, updateCard, toggleLearned, removeCard } = useDecks();
  const deck = decks.find(deck => deck.id === id);

  if (status === 'loading') {
    return <Loader text="Загружаем колоду…" />;
  }

  if (status === 'error') {
    return <ErrorMessage text={error} onRetry={reload} />;
  }

  if (!deck) {
    return <NotFoundMessage title="Колода не найдена" text="Возможно, её удалили или адрес набран с ошибкой" />;
  }

  const { cards } = deck;

  return (
    <>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Назад
      </Button>
      <Typography variant="h4" gutterBottom>
        {deck.title}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {deck.description}
      </Typography>
      <RemoveDeckButton title={deck.title} onRemove={async () => {
        await removeDeck(deck.id);
        navigate('/', { replace: true });
      }} />
      <ToggleSection openLabel="Редактировать колоду">
        <EditDeckForm deck={deck}
          existingTitles={decks.filter(item => item.id !== deck.id).map(item => item.title)}
          onSave={(title, description) => updateDeck(deck.id, title, description)} />
      </ToggleSection>
      <Trainer key={`${id}:${cards.map(card => card.id).join(',')}`} cards={cards} />
      <ToggleSection openLabel="Добавить карточку">
        <CardForm
          existingQuestions={cards.map(card => card.question)}
          onAdd={(question, answer) => addCard(deck.id, question, answer)}
        />
      </ToggleSection>
      {cards.length === 0 ? (
        <EmptyState>Тут пусто, добавь первую карточку</EmptyState>
      ) : (
        cards.map(card => (
          <AnimatedItem key={card.id}>
            <CardView
              card={card}
              actions={
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <EditCardButton card={card}
                    existingQuestions={cards.filter(item => item.id !== card.id).map(item => item.question)}
                    onSave={(question, answer) => updateCard(deck.id, card.id, question, answer)} />
                  <ToggleLearnedButton learned={card.learned} onToggle={() => toggleLearned(deck.id, card.id, !card.learned)} />
                  <RemoveCardButton onRemove={() => removeCard(deck.id, card.id)} />
                </Box>
              }
            />
          </AnimatedItem>
        ))
      )}
    </>
  );
}
