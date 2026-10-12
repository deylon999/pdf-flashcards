import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useDecks } from '@/entities/deck';
import { CardView } from '@/entities/card';
import { CardForm } from '@/features/add-card';
import { Trainer } from '@/features/train-deck';
import { ToggleLearnedButton } from '@/features/toggle-learned';
import { RemoveCardButton } from '@/features/remove-card';
import { EmptyState } from '@/shared/ui';

export function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { decks, addCard, toggleLearned, removeCard } = useDecks();
  const deck = decks.find(deck => deck.id === id);

  if (!deck) {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Колода не найдена
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          На главную
        </Button>
      </>
    );
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
      <Trainer key={id} cards={cards} />
      <CardForm onAdd={(question, answer) => addCard(deck.id, question, answer)} />
      {cards.length === 0 ? (
        <EmptyState>Тут пусто, добавь первую карточку</EmptyState>
      ) : (
        cards.map(card => (
          <CardView
            key={card.id}
            card={card}
            actions={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <ToggleLearnedButton learned={card.learned} onToggle={() => toggleLearned(deck.id, card.id)} />
                <RemoveCardButton onRemove={() => removeCard(deck.id, card.id)} />
              </Box>
            }
          />
        ))
      )}
    </>
  );
}
