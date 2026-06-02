import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from './Button';
import { Card } from './Card';

interface SectionErrorBoundaryProps {
  section: string;
  children: ReactNode;
}

interface SectionErrorBoundaryState {
  error: Error | null;
}

export class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  state: SectionErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[widget:${this.props.section}]`, error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <Card className="border-danger/30 bg-danger/10 p-4">
          <p className="text-sm font-semibold text-text-primary">No pudimos cargar {this.props.section}</p>
          <p className="mt-1 text-module-body text-text-secondary">
            El resto del widget sigue disponible. Probá recargar esta sección.
          </p>
          <Button className="mt-3" size="sm" variant="secondary" onClick={this.reset}>
            Reintentar
          </Button>
        </Card>
      );
    }
    return this.props.children;
  }
}
