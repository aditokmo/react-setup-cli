import { authRoutes } from '@/modules/auth/routes';
import { NotFound } from '@/modules/common/pages';
import { useRoutes } from 'react-router-dom';

// Exaxmple: Import feature routes here
// import { dashboardRoutes } from '@/features/dashboard/routes';

export function AppRoutes() {
    return useRoutes([
        // Spread feature routes here
        ...authRoutes,
        {
            path: '*',
            element: <NotFound />
        }
        // ...dashboardRoutes,
    ]);
}