export const MAX_LENGTH = 500;

export type CardFormValues = {
  question: string;
  answer: string;
};

export type CardFormErrors = Partial<Record<keyof CardFormValues, string>>;

function checkText(value: string, label: string) {
  const text = value.trim();
  if (!text) {
    return `${label} не может быть пустым`;
  }
  if (text.length > MAX_LENGTH) {
    return `${label} длиннее ${MAX_LENGTH} символов`;
  }
  return undefined;
}

export function validateCard(values: CardFormValues, existingQuestions: string[]): CardFormErrors {
  const errors: CardFormErrors = {};

  const questionError = checkText(values.question, 'Вопрос');
  if (questionError) {
    errors.question = questionError;
  } else {
    const question = values.question.trim().toLowerCase();
    if (existingQuestions.some(existing => existing.trim().toLowerCase() === question)) {
      errors.question = 'Такой вопрос в колоде уже есть';
    }
  }

  const answerError = checkText(values.answer, 'Ответ');
  if (answerError) {
    errors.answer = answerError;
  }

  return errors;
}
