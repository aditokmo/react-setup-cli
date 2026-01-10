import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

export function ProtectedRoute({
    children,
    redirectTo,
}: ProtectedRouteProps) {
    // Example: Replace with your auth/session logic
    // const { isAuthenticated, isLoading } = useSession();

    const isAuthenticated = true;
    const isLoading = false;

    if (isLoading) {
        // Replace with loader
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo ?? '/'} replace />;
    }

    return children;
}