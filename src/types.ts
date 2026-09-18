export type Card = {
  id: string;
  question: string;
  answer: string;
  learned: boolean;
};

export type Deck = {
  id: string;
  title: string;
  description: string;
  cards: Card[];
};
