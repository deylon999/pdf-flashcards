import type { Card } from '@/entities/card';

export type Deck = {
  id: string;
  title: string;
  description: string;
  cards: Card[];
};
