import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout/AppLayout';
import HomePage from './page';
import ResumeBuilder from './resume/page';
import AboutPage from './about/page';

function withLayout(Page: () => React.JSX.Element) {
  return <AppLayout><Page /></AppLayout>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: withLayout(HomePage),
  },
  {
    path: '/resume',
    element: withLayout(ResumeBuilder),
  },
  {
    path: '/about',
    element: withLayout(AboutPage),
  },
]);
