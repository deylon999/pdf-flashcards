import { CardForm as Form } from '@/entities/card';

type Props = {
  existingQuestions: string[];
  onAdd: (question: string, answer: string) => Promise<void>;
};

export function CardForm({ existingQuestions, onAdd }: Props) {
  return <Form existingQuestions={existingQuestions} onSave={onAdd} resetAfterSave />;
}
