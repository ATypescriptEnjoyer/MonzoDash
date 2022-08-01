import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AppLayout } from './layouts';
import { Dashboard, Login, TwoFactor } from './pages';
import { StyledAppRoute } from './Routes.styled';

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
