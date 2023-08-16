import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { CapitalGains, MortgageCrusher } from './index';
import { ThemeProvider } from './ThemeProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/capital-gains',
    element: <CapitalGains />,
  },
  {
    path: '/mortgage-crusher',
    element: <MortgageCrusher />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
