import React from 'react';
import { Result, Button } from 'antd';
import { logger } from '../utils/debugger';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    logger.error('React Error Caught by Error Boundary', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });

    // Store error details
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optional: Reload the page
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Result
            status="error"
            title="Something went wrong"
            subTitle={
              process.env.NODE_ENV === 'development' &&
              this.state.error?.toString()
            }
            extra={
              <div>
                <Button type="primary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    logger.info(
                      'Error Details:',
                      this.state.errorInfo.componentStack
                    );
                    window.location.href = '/';
                  }}
                >
                  Go Home
                </Button>
              </div>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
