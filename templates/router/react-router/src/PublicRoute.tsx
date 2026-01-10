import { Navigate } from 'react-router-dom';

type PublicRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

export function PublicRoute({
    children,
    redirectTo,
}: PublicRouteProps) {
    // Example: Replace with your auth/session logic
    // const { isAuthenticated, isLoading } = useSession();

    const isAuthenticated = false;
    const isLoading = false;

    if (isLoading) {
        // Replace with loader
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo ?? '/'} replace />;
    }

    return children;
}