import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { getErrorMessage, type LoadStatus } from '@/shared/api';
import { fetchDecks } from '../api/deckApi';
import { DecksContext, type DecksContextValue } from './DecksContext';
import { decksReducer } from './decksReducer';

type Props = {
  children: ReactNode;
  active: boolean;
};

export function DecksProvider({ children, active }: Props) {
  const [decks, dispatch] = useReducer(decksReducer, []);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState('');
  const requestId = useRef(0);

  function load() {
    if (!active) return;
    const id = ++requestId.current;
    setStatus('loading');
    setError('');
    fetchDecks()
      .then(loaded => {
        if (id !== requestId.current) return;
        dispatch({ type: 'loaded', decks: loaded });
        setStatus('ready');
      })
      .catch(failure => {
        if (id !== requestId.current) return;
        setError(getErrorMessage(failure));
        setStatus('error');
      });
  }

  useEffect(() => {
    load();
    return () => { requestId.current++; };
  }, [active]);

  const value: DecksContextValue = {
    decks,
    status,
    error,
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
