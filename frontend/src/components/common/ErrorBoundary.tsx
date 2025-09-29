import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh', padding: '2rem' }}>
          <Message 
            severity="error" 
            text="Something went wrong. Please try refreshing the page."
            className="mb-4"
          />
          <Button 
            label="Reload Page" 
            icon="pi pi-refresh" 
            onClick={this.handleReload}
            className="p-button-outlined"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
