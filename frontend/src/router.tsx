import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './application/Dashboard/Dashboard';
import { Navigate } from 'react-router-dom';
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
]);