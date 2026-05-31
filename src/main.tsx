import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BrandingPreviewBridge } from './components/BrandingPreviewBridge';
import { BrandingBootstrap } from './components/BrandingBootstrap';
import { DemoAuthBootstrap } from './components/DemoAuthBootstrap';
import { unregisterMockServiceWorkers } from './lib/unregisterMockServiceWorker';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

async function enableMocking() {
  const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';
  if (typeof window === 'undefined') return;
  if (!useMocks) {
    await unregisterMockServiceWorkers();
    return;
  }
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <DemoAuthBootstrap>
          <BrandingBootstrap>
            <BrandingPreviewBridge />
            <App />
          </BrandingBootstrap>
        </DemoAuthBootstrap>
      </BrowserRouter>
    </StrictMode>,
  );
});
