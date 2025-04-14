import { useEffect, useState } from "react";
import { Timer } from "@/components/Timer";
import { Question } from "@/components/Question";
import { Results } from "@/components/Results";
import { Progress } from "@/components/ui/progress";
import {
	type Question as QuestionType,
	type QuizData,
	type UserAnswer,
} from "@/types";
import { Brain } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundry";

function App() {
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showResults, setShowResults] = useState(false);

	useEffect(() => {
		fetch("http://localhost:3001/data")
			.then((response) => response.json())
			.then((data: QuizData) => {
				setQuestions(data.data.questions);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching questions:", error);
				setIsLoading(false);
			});
	}, []);

	const handleTimeUp = () => {
		// Record a default answer if none provided
		const currentQuestion = questions[currentQuestionIndex];
		const hasAnswered = userAnswers.some(
			(answer) => answer.questionId === currentQuestion.questionId,
		);
		if (!hasAnswered) {
			setUserAnswers((prev) => [
				...prev,
				{
					questionId: currentQuestion.questionId,
					answers: [],
					isCorrect: false,
				},
			]);
		}

		// Move to next question or show results
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		} else {
			setShowResults(true);
		}
	};

	const handleNextQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		} else {
			setShowResults(true);
		}
	};

	const handleAnswer = (answers: (string | null)[]) => {
		const currentQuestion = questions[currentQuestionIndex];
		const isCorrect = answers.every(
			(answer, index) => answer === currentQuestion.correctAnswer[index],
		);

		// Prevent duplicate answers
		const hasAnswered = userAnswers.some(
			(answer) => answer.questionId === currentQuestion.questionId,
		);
		if (!hasAnswered) {
			setUserAnswers((prev) => [
				...prev,
				{
					questionId: currentQuestion.questionId,
					answers,
					isCorrect,
				},
			]);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Brain className="w-12 h-12 animate-bounce mx-auto mb-4" />
					<p className="text-lg">Loading questions...</p>
				</div>
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg">No questions available.</p>
			</div>
		);
	}

	if (showResults) {
		return (
			<ErrorBoundary>
				<Results userAnswers={userAnswers} questions={questions} />
			</ErrorBoundary>
		);
	}

	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
						<Brain className="w-8 h-8" />
						Sentence Construction Quiz
					</h1>
					<Progress
						value={((currentQuestionIndex + 1) / questions.length) * 100}
						className="h-2"
					/>
					<p className="text-muted-foreground mt-2">
						Question {currentQuestionIndex + 1} of {questions.length}
					</p>
				</div>

				<div className="bg-card rounded-lg shadow-lg p-6">
					<div className="flex justify-end mb-4">
						<Timer
							key={currentQuestionIndex}
							duration={60}
							onTimeUp={handleTimeUp}
						/>
					</div>

					<Question
						question={questions[currentQuestionIndex]}
						onAnswer={handleAnswer}
						onNext={handleNextQuestion}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
