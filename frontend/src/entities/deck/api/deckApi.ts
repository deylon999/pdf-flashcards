import { apiRequest } from '@/shared/api';
import type { Deck } from '../model/types';

type DeckResponse = {
  id: number;
  title: string;
  description: string;
  cards: {
    id: number;
    question: string;
    answer: string;
    learned: boolean;
  }[];
};

export async function fetchDecks(): Promise<Deck[]> {
  const decks = await apiRequest<DeckResponse[]>('/decks');
  return decks.map(deck => ({
    ...deck,
    id: String(deck.id),
    cards: deck.cards.map(card => ({ ...card, id: String(card.id) })),
  }));
}

export async function createDeck(title: string, description: string): Promise<Deck> {
  const deck = await apiRequest<{ id: number; title: string; description: string }>('/decks', {
    method: 'POST', body: JSON.stringify({ title, description }),
  });
  return { ...deck, id: String(deck.id), cards: [] };
}
