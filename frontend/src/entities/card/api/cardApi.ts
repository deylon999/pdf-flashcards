import { apiRequest } from '@/shared/api';
import type { Card } from '../model/types';

type CardResponse = {
  id: number;
  question: string;
  answer: string;
  learned: boolean;
};

export async function createCard(deckId: string, question: string, answer: string): Promise<Card> {
  const card = await apiRequest<CardResponse>(`/decks/${deckId}/cards`, {
    method: 'POST', body: JSON.stringify({ question, answer }),
  });
  return { ...card, id: String(card.id) };
}

export async function updateCard(cardId: string, data: {
  question?: string; answer?: string; learned?: boolean;
}): Promise<Card> {
  const card = await apiRequest<CardResponse>(`/cards/${cardId}`, {
    method: 'PATCH', body: JSON.stringify(data),
  });
  return { ...card, id: String(card.id) };
}

export function deleteCard(cardId: string): Promise<void> {
  return apiRequest(`/cards/${cardId}`, { method: 'DELETE' });
}
