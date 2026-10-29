import type { Card } from '@/entities/card';
import type { Deck } from './types';

export type DecksAction =
  | { type: 'loaded'; decks: Deck[] }
  | { type: 'addDeck'; deck: Deck }
  | { type: 'updateDeck'; deckId: string; title: string; description: string }
  | { type: 'removeDeck'; deckId: string }
  | { type: 'addCard'; deckId: string; card: Card }
  | { type: 'replaceCard'; deckId: string; card: Card }
  | { type: 'toggleLearned'; deckId: string; cardId: string }
  | { type: 'removeCard'; deckId: string; cardId: string };

function updateCards(decks: Deck[], deckId: string, update: (cards: Card[]) => Card[]) {
  return decks.map(deck => (deck.id === deckId ? { ...deck, cards: update(deck.cards) } : deck));
}

export function decksReducer(decks: Deck[], action: DecksAction): Deck[] {
  switch (action.type) {
    case 'loaded':
      return action.decks;
    case 'addDeck':
      return [...decks, action.deck];
    case 'updateDeck':
      return decks.map(deck => deck.id === action.deckId
        ? { ...deck, title: action.title, description: action.description } : deck);
    case 'removeDeck':
      return decks.filter(deck => deck.id !== action.deckId);
    case 'addCard':
      return updateCards(decks, action.deckId, cards => [...cards, action.card]);
    case 'replaceCard':
      return updateCards(decks, action.deckId, cards =>
        cards.map(card => card.id === action.card.id ? action.card : card));
    case 'toggleLearned':
      return updateCards(decks, action.deckId, cards =>
        cards.map(card => (card.id === action.cardId ? { ...card, learned: !card.learned } : card))
      );
    case 'removeCard':
      return updateCards(decks, action.deckId, cards => cards.filter(card => card.id !== action.cardId));
  }
}
