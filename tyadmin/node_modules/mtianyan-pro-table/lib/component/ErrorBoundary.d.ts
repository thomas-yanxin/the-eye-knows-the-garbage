import React, { ErrorInfo } from 'react';
declare class ErrorBoundary extends React.Component<{}, {
    hasError: boolean;
    errorInfo: string;
}> {
    state: {
        hasError: boolean;
        errorInfo: string;
    };
    static getDerivedStateFromError(error: Error): {
        hasError: boolean;
        errorInfo: string;
    };
    componentDidCatch(error: any, errorInfo: ErrorInfo): void;
    render(): {} | null | undefined;
}
export default ErrorBoundary;
