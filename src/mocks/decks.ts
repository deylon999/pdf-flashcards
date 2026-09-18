import type { Deck } from '../types';

export const decks: Deck[] = [
  {
    id: '1',
    title: 'Английский',
    description: 'Базовые слова',
    cards: [
      { id: '1-1', question: 'apple', answer: 'яблоко', learned: true },
      { id: '1-2', question: 'window', answer: 'окно', learned: true },
      { id: '1-3', question: 'bridge', answer: 'мост', learned: false },
      { id: '1-4', question: 'knowledge', answer: 'знание', learned: false },
      { id: '1-5', question: 'weather', answer: 'погода', learned: false },
    ],
  },
  {
    id: '2',
    title: 'TypeScript',
    description: 'Термины и основы языка',
    cards: [
      { id: '2-1', question: 'Что такое type?', answer: 'Описание формы данных, существует только при компиляции', learned: true },
      { id: '2-2', question: 'Чем string отличается от String?', answer: 'string — примитивный тип, String — объект-обёртка', learned: false },
      { id: '2-3', question: 'Что значит Card[]?', answer: 'Массив объектов типа Card', learned: false },
      { id: '2-4', question: 'Что делает export?', answer: 'Открывает доступ к значению или типу из других файлов', learned: false },
    ],
  },
  {
    id: '3',
    title: 'История',
    description: 'Даты, которые вечно забываю',
    cards: [
      { id: '3-1', question: 'Крещение Руси', answer: '988 год', learned: true },
      { id: '3-2', question: 'Куликовская битва', answer: '1380 год', learned: false },
      { id: '3-3', question: 'Отмена крепостного права', answer: '1861 год', learned: false },
    ],
  },
];
