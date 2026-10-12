import { createContext, useContext } from 'react';
import type { Deck } from './types';

export type DecksContextValue = {
  decks: Deck[];
  addCard: (deckId: string, question: string, answer: string) => void;
  toggleLearned: (deckId: string, cardId: string) => void;
  removeCard: (deckId: string, cardId: string) => void;
};

export const DecksContext = createContext<DecksContextValue | null>(null);

export function useDecks() {
  const value = useContext(DecksContext);
  if (!value) {
    throw new Error('useDecks нужно вызывать внутри DecksProvider');
  }
  return value;
}
