import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer as TimerIcon } from "lucide-react";

interface TimerProps {
	duration: number;
	onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
	const [timeLeft, setTimeLeft] = useState(duration);

	// Timer countdown logic
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Trigger onTimeUp when timeLeft reaches 0
	useEffect(() => {
		if (timeLeft === 0) {
			onTimeUp();
		}
	}, [timeLeft, onTimeUp]);

	// Reset timeLeft when duration changes
	useEffect(() => {
		setTimeLeft(duration);
	}, [duration]);

	const progress = (timeLeft / duration) * 100;

	return (
		<div className="inline-flex items-center gap-2 bg-muted p-2 rounded-md">
			<TimerIcon className="w-4 h-4" />
			<Progress value={progress} className="w-24 h-2" />
			<span className="min-w-[2.5rem] text-sm">{timeLeft}s</span>
		</div>
	);
}
