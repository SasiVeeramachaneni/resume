import { createBrowserRouter } from 'react-router-dom';
import HomePage from './page';
import ResumeBuilder from './resume/page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/resume',
    element: <ResumeBuilder />,
  },
]);
