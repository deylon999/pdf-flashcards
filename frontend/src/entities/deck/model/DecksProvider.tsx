import { useReducer, type ReactNode } from 'react';
import { decks as initialDecks } from '../api/mock';
import { DecksContext, type DecksContextValue } from './DecksContext';
import { decksReducer } from './decksReducer';

type Props = {
  children: ReactNode;
};

export function DecksProvider({ children }: Props) {
  const [decks, dispatch] = useReducer(decksReducer, initialDecks);

  const value: DecksContextValue = {
    decks,
    addCard: (deckId, question, answer) =>
      dispatch({
        type: 'addCard',
        deckId,
        card: { id: String(Date.now()), question, answer, learned: false },
      }),
    toggleLearned: (deckId, cardId) => dispatch({ type: 'toggleLearned', deckId, cardId }),
    removeCard: (deckId, cardId) => dispatch({ type: 'removeCard', deckId, cardId }),
  };

  return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>;
}
