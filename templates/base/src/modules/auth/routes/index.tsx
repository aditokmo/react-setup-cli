import { Login, Register, ForgotPassword } from '../pages';

export const authRoutes = [
    {
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            }
            // Edit or Add routes as needed
        ]
    }
]