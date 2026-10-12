export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 300;

export type DeckFormValues = {
  title: string;
  description: string;
};

export type DeckFormErrors = Partial<Record<keyof DeckFormValues, string>>;

export function validateDeck(values: DeckFormValues, existingTitles: string[]): DeckFormErrors {
  const errors: DeckFormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (!title) {
    errors.title = 'Введите название колоды';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Название длиннее ${TITLE_MAX_LENGTH} символов`;
  } else if (existingTitles.some(existing => existing.trim().toLowerCase() === title.toLowerCase())) {
    errors.title = 'Колода с таким названием уже есть';
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Описание длиннее ${DESCRIPTION_MAX_LENGTH} символов`;
  }

  return errors;
}
