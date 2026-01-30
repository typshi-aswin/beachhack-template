import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './application/Dashboard/Dashboard';
import Login from './application/Login/Login';

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
    {
        path: '/login',
        element: <Login />
    }
]);