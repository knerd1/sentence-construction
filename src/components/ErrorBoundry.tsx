// ErrorBoundary.tsx
import { Component, ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <div>Something went wrong. Please try again.</div>;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
