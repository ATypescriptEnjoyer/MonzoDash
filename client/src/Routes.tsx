import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AppLayout } from './layouts';
import { StyledAppRoute } from './Routes.styled';
import { NewDashboard } from './pages/NewDashboard';
import { TwoFactor } from './pages/TwoFactor';
import { Login } from './pages/Login';
import { AppLogin } from './pages/AppLogin';

const routes = (isMonzoAuthed: boolean): RouteObject[] => [
  {
    path: '/app',
    element: isMonzoAuthed ? (
      <StyledAppRoute>
        <AppLayout />
        <Outlet />
      </StyledAppRoute>
    ) : (
      <Navigate to="/login" />
    ),
    children: [
      {
        path: '/app/dashboard',
        element: <NewDashboard />,
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
