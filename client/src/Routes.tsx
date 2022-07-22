import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AppLayout } from './layouts';
import { AddAction, AddTrigger, Dashboard, Login, TwoFactor } from './pages';

const routes = (isMonzoAuthed: boolean): RouteObject[] => [
  {
    path: '/app',
    element: isMonzoAuthed ? (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppLayout />
        <Outlet />
      </div>
    ) : (
      <Navigate to="/login" />
    ),
    children: [
      {
        path: '/app/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/app/actions/add',
        element: <AddAction />,
      },
      {
        path: '/app/triggers/add',
        element: <AddTrigger />,
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
