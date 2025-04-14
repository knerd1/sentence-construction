import { CheckCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Question, type UserAnswer } from '@/types';
import { cn } from '@/lib/utils';

interface ResultsProps {
  userAnswers: UserAnswer[];
  questions: Question[];
}

export function Results({ userAnswers, questions }: ResultsProps) {
  const score = userAnswers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              You scored {score} out of {totalQuestions} ({percentage.toFixed(1)}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  percentage >= 70
                    ? 'bg-green-500'
                    : percentage >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const parts = question.question.split('_____________');

            return (
              <Card key={question.questionId}>
                <CardHeader className="flex flex-row items-center gap-2">
                  <div
                    className={cn(
                      'p-1.5 rounded-full',
                      userAnswer.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                    )}
                  >
                    {userAnswer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg leading-relaxed">
                    {parts.map((part, pIndex) => (
                      <span key={pIndex}>
                        {part}
                        {pIndex < parts.length - 1 && (
                          <span
                            className={cn(
                              'mx-2 px-4 py-1 rounded',
                              userAnswer.answers[pIndex] ===
                                question.correctAnswer[pIndex]
                                ? 'bg-green-500/20 text-green-700'
                                : 'bg-red-500/20 text-red-700'
                            )}
                          >
                            {userAnswer.answers[pIndex]}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  {!userAnswer.isCorrect && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="font-medium mb-2">Correct Answer:</p>
                      <div className="text-lg">
                        {parts.map((part, pIndex) => (
                          <span key={pIndex}>
                            {part}
                            {pIndex < parts.length - 1 && (
                              <span className="mx-2 px-4 py-1 rounded bg-green-500/20 text-green-700">
                                {question.correctAnswer[pIndex]}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}