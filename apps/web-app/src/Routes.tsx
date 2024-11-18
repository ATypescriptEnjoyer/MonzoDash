import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AppLogin } from './pages/AppLogin';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { TwoFactor } from './pages/TwoFactor';

const routes = (isMonzoAuthed: boolean): RouteObject[] => [
  {
    path: '/app',
    element: isMonzoAuthed ? <Outlet /> : <Navigate to="/login" />,
    children: [
      {
        path: '/app/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/app',
        element: <Navigate to="/app/dashboard" />,
      },
    ],
  },
  {
    path: '/',
    element: !isMonzoAuthed ? <Outlet /> : <Navigate to="/app/dashboard" />,
    children: [
      {
        path: '/login/verify',
        element: <TwoFactor />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/app-login',
        element: <AppLogin />,
      },
      {
        path: '',
        element: <Navigate to="/login" />,
      },
      {
        path: '/*',
        element: <Navigate to="/login" />,
      },
    ],
  },
];

export default routes;
