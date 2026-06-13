import '@mantine/core/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import { ResumeProvider } from './components/declarations/ResumeContext';
import { router } from './app/router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider theme={theme}>
    <ResumeProvider>
      <RouterProvider router={router} />
    </ResumeProvider>
  </MantineProvider>
);
