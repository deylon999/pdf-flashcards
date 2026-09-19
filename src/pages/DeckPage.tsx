import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { decks } from '../mocks/decks';
import { CardForm } from '../components/CardForm';
import { CardItem } from '../components/CardItem';
import { Trainer } from '../components/Trainer';
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
      <Trainer key={id} cards={cards} />
      <CardForm onAdd={addCard} />
      {cards.length === 0 ? (
        <Typography color="text.secondary">Тут пусто, добавь первую карточку</Typography>
      ) : (
        cards.map(card => <CardItem key={card.id} card={card} />)
      )}
    </>
  );
}
