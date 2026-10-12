import type { Card } from '@/entities/card';
import type { Deck } from './types';

export type DecksAction =
  | { type: 'addDeck'; deck: Deck }
  | { type: 'addCard'; deckId: string; card: Card }
  | { type: 'toggleLearned'; deckId: string; cardId: string }
  | { type: 'removeCard'; deckId: string; cardId: string };

function updateCards(decks: Deck[], deckId: string, update: (cards: Card[]) => Card[]) {
  return decks.map(deck => (deck.id === deckId ? { ...deck, cards: update(deck.cards) } : deck));
}

export function decksReducer(decks: Deck[], action: DecksAction): Deck[] {
  switch (action.type) {
    case 'addDeck':
      return [...decks, action.deck];
    case 'addCard':
      return updateCards(decks, action.deckId, cards => [...cards, action.card]);
    case 'toggleLearned':
      return updateCards(decks, action.deckId, cards =>
        cards.map(card => (card.id === action.cardId ? { ...card, learned: !card.learned } : card))
      );
    case 'removeCard':
      return updateCards(decks, action.deckId, cards => cards.filter(card => card.id !== action.cardId));
  }
}
