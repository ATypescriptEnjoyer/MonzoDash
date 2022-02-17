import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AppLayout } from './layouts';
import { AddAction, Dashboard, Setup } from './pages';

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
      <Navigate to="/setup" />
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
        path: '/setup/two-factor',
        element: <Outlet />,
      },
      {
        path: '/setup',
        element: <Setup />,
      },
      {
        path: '',
        element: <Navigate to="/setup" />,
      },
    ],
  },
];

export default routes;
