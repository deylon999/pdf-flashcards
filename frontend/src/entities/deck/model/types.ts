import type { Card } from '../../card';

export type Deck = {
  id: string;
  title: string;
  description: string;
  cards: Card[];
};
