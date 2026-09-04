import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import CreatePage from '@/pages/create';
import Home from '@/pages/home';
import LibraryPage from '@/pages/library';
import ProfilePage from '@/pages/profile';
import SearchPage from '@/pages/search';
import CreatorPage from '@/pages/creator';
import { SadoProvider, SadoShell } from '@/components/sado-shell';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <SadoShell>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={SearchPage} />
          <Route path="/library" component={LibraryPage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/creator/:id" component={CreatorPage} />
          <Route component={NotFound} />
        </Switch>
      </SadoShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SadoProvider><Router /></SadoProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
