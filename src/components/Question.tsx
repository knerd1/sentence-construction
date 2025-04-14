import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { type Question as QuestionType } from '@/types';
import { cn } from '@/lib/utils';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answers: (string | null)[]) => void;
  onNext: () => void;
}

export function Question({ question, onAnswer, onNext }: QuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setSelectedAnswers([null, null, null, null]);
    setSelectedOptionIndex(null);
  }, [question]);

  const handleBlankClick = (index: number) => {
    if (selectedAnswers[index]) {
      const newAnswers = [...selectedAnswers];
      newAnswers[index] = null;
      setSelectedAnswers(newAnswers);
    }
  };

  const handleOptionClick = (option: string, index: number) => {
    const emptySlotIndex = selectedAnswers.findIndex((answer) => answer === null);
    if (emptySlotIndex !== -1) {
      const newAnswers = [...selectedAnswers];
      newAnswers[emptySlotIndex] = option;
      setSelectedAnswers(newAnswers);
      setSelectedOptionIndex(index);
    }
  };

  const handleNext = () => {
    onAnswer(selectedAnswers);
    onNext();
  };

  const isComplete = selectedAnswers.every((answer) => answer !== null);

  const parts = question.question.split('_____________');

  return (
    <div className="space-y-8">
      <div className="text-lg leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <button
                onClick={() => handleBlankClick(index)}
                className={cn(
                  'mx-2 min-w-32 px-4 py-1 rounded border-2',
                  selectedAnswers[index]
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-dashed border-muted-foreground'
                )}
              >
                {selectedAnswers[index] || '_____'}
              </button>
            )}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedOptionIndex === index ? 'secondary' : 'outline'}
            className="h-auto py-2 px-4"
            onClick={() => handleOptionClick(option, index)}
            disabled={selectedAnswers.includes(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isComplete}>
          Next Question
        </Button>
      </div>
    </div>
  );
}