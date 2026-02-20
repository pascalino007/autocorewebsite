// react
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo
        });

        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Error Boundary Details');
            console.error('Error:', error);
            console.error('Error Info:', errorInfo);
            console.error('Component Stack:', errorInfo.componentStack);
            console.groupEnd();
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '8px',
                    backgroundColor: '#ffe0e0',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#d63031', marginBottom: '10px' }}>
                        Something went wrong
                    </h3>
                    
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div style={{ textAlign: 'left', fontSize: '12px', color: '#666' }}>
                            <strong>Error:</strong> {this.state.error.message}
                            {this.state.error.status && (
                                <span> (Status: {this.state.error.status})</span>
                            )}
                            {this.state.error.path && (
                                <span> (Path: {this.state.error.path})</span>
                            )}
                            <br />
                            <button
                                onClick={this.handleRetry}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: '#0984e3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {process.env.NODE_ENV === 'production' && (
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                            An unexpected error occurred. Please refresh the page and try again.
                        </p>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
