import { delay } from '@/shared/lib';
import type { Deck } from '../model/types';
import { decks } from './mock';

// Пока нет подключения к backend, данные отдаются из моков с задержкой.
// Для проверки состояний: ?fail в адресе — ошибка загрузки, ?empty — пустой список.
export async function fetchDecks(): Promise<Deck[]> {
  await delay(600);
  const params = new URLSearchParams(window.location.search);
  if (params.has('fail')) {
    throw new Error('Не удалось загрузить колоды');
  }
  if (params.has('empty')) {
    return [];
  }
  return structuredClone(decks);
}
