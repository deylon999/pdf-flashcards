import { useEffect, useReducer, useState, type ReactNode } from 'react';
import type { LoadStatus } from '@/shared/api';
import { fetchDecks } from '../api/deckApi';
import { DecksContext, type DecksContextValue } from './DecksContext';
import { decksReducer } from './decksReducer';

type Props = {
  children: ReactNode;
};

export function DecksProvider({ children }: Props) {
  const [decks, dispatch] = useReducer(decksReducer, []);
  const [status, setStatus] = useState<LoadStatus>('loading');

  function load() {
    setStatus('loading');
    fetchDecks()
      .then(loaded => {
        dispatch({ type: 'loaded', decks: loaded });
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(() => {
    load();
  }, []);

  const value: DecksContextValue = {
    decks,
    status,
    reload: load,
    addDeck: (title, description) =>
      dispatch({ type: 'addDeck', deck: { id: String(Date.now()), title, description, cards: [] } }),
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
