import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Dashboard from './application/Dashboard/Dashboard';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/home" replace />
    },
    {
        path: '/home',
        element: <Dashboard />
    },
]);