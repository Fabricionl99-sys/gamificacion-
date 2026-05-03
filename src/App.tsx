import { Suspense, lazy } from 'react';
import { Skeleton } from './components/ui/Skeleton';

const WidgetContainer = lazy(() =>
  import('./components/layout/WidgetContainer').then((module) => ({ default: module.WidgetContainer })),
);

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-bg-primary p-4 text-text-primary">
          <div className="mx-auto max-w-[460px] space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-10" />
            <Skeleton className="h-32" />
          </div>
        </div>
      }
    >
      <WidgetContainer />
    </Suspense>
  );
}
