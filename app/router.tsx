import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout/AppLayout';
import HomePage from './page';
import ResumeBuilder from './resume/page';
import AboutPage from './about/page';
import BlogPage from './blog/page';
import BlogPostPage from './blog/BlogPostPage';
import NotFoundPage from './not-found';
import EditorPage from './editor/page';

function withLayout(Page: () => React.JSX.Element | null) {
  return <AppLayout><Page /></AppLayout>;
}

const routes = [
  { path: '/', element: withLayout(HomePage) },
  { path: '/resume', element: withLayout(ResumeBuilder) },
  { path: '/about', element: withLayout(AboutPage) },
  { path: '/blog', element: withLayout(BlogPage) },
  { path: '/blog/:slug', element: withLayout(BlogPostPage) },
  { path: '*', element: withLayout(NotFoundPage) },
];

if (import.meta.env.DEV) {
  routes.push({ path: '/editor', element: withLayout(EditorPage) });
}

export const router = createBrowserRouter(routes);
