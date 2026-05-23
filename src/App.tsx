import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Skeleton } from './components/ui/Skeleton';

const DemoPage = lazy(() => import('./demo/DemoPage'));
const WidgetContainer = lazy(() =>
  import('./components/layout/WidgetContainer').then((module) => ({ default: module.WidgetContainer })),
);

function AppFallback() {
  return (
    <div className="min-h-dvh bg-bg-primary p-4 text-text-primary">
      <div className="mx-auto max-w-[460px] space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-10" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AppFallback />}>
      <Routes>
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/*" element={<WidgetContainer />} />
      </Routes>
    </Suspense>
  );
}
