import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

export const renderWithProviders = renderWithRouter;
