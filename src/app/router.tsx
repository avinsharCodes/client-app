import { createBrowserRouter } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { CallbackPage } from '../pages/CallbackPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

const Fallback = () => (
    <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground mt-2">The application encountered an unexpected error.</p>
        </div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ErrorBoundary fallback={<Fallback />}>
                <HomePage />
            </ErrorBoundary>
        ),
    },
    {
        path: '/dashboard',
        element: (
            <ErrorBoundary fallback={<Fallback />}>
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },
    {
        path: '/callback',
        element: (
            <ErrorBoundary fallback={<Fallback />}>
                <CallbackPage />
            </ErrorBoundary>
        ),
    },
]);
