import { createContext, useContext } from 'react';
import type { LoadStatus } from '@/shared/api';
import type { Deck } from './types';

export type DecksContextValue = {
  decks: Deck[];
  status: LoadStatus;
  error: string;
  reload: () => void;
  addDeck: (title: string, description: string) => void;
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
