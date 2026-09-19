import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { decks } from '../mocks/decks';
import { CardForm } from '../components/CardForm';
import { CardItem } from '../components/CardItem';
import type { Card } from '../types';

export function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deck = decks.find(deck => deck.id === id);
  const [cards, setCards] = useState<Card[]>(deck ? deck.cards : []);

  useEffect(() => {
    const found = decks.find(deck => deck.id === id);
    setCards(found ? found.cards : []);
  }, [id]);

  if (!deck) {
    return <Typography>Такой колоды нет</Typography>;
  }

  function addCard(question: string, answer: string) {
    const card: Card = {
      id: String(Date.now()),
      question,
      answer,
      learned: false,
    };
    setCards([...cards, card]);
  }

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
      <CardForm onAdd={addCard} />
      {cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
    </>
  );
}
