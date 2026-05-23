import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BrandingBootstrap } from './components/BrandingBootstrap';
import { DemoAuthBootstrap } from './components/DemoAuthBootstrap';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

async function enableMocking() {
  const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';
  if (typeof window === 'undefined') return;
  if (!useMocks) {
    // Defensa: visitors que entraron al widget cuando MSW estaba activo dejan
    // registrado mockServiceWorker.js, que sigue interceptando requests
    // aunque el bundle ya no lo inicie. Resultado: el widget muestra datos
    // mockeados y "no ve" cambios del BO. Des-registrar al boot en prod.
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
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
            <App />
          </BrandingBootstrap>
        </DemoAuthBootstrap>
      </BrowserRouter>
    </StrictMode>,
  );
});
