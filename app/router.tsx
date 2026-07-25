import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout/AppLayout";
import { Loader, Center } from "@mantine/core";

const HomePage = lazy(() => import("./page"));
const ResumeBuilder = lazy(() => import("./resume/page"));
const AboutPage = lazy(() => import("./about/page"));
const BlogPage = lazy(() => import("./blog/page"));
const BlogPostPage = lazy(() => import("./blog/BlogPostPage"));
const TechPage = lazy(() => import("./tech/page"));
const NotFoundPage = lazy(() => import("./not-found"));
const EditorPage = lazy(() => import("./editor/page"));

function withLayout(Page: React.ComponentType) {
  return (
    <AppLayout>
      <Suspense
        fallback={
          <Center style={{ height: "50vh" }}>
            <Loader size="md" />
          </Center>
        }
      >
        <Page />
      </Suspense>
    </AppLayout>
  );
}

const routes = [
  { path: "/", element: withLayout(HomePage) },
  { path: "/resume", element: withLayout(ResumeBuilder) },
  { path: "/about", element: withLayout(AboutPage) },
  { path: "/blog", element: withLayout(BlogPage) },
  { path: "/blog/:slug", element: withLayout(BlogPostPage) },
  { path: "/tech", element: withLayout(TechPage) },
  { path: "*", element: withLayout(NotFoundPage) },
];

if (import.meta.env.DEV) {
  routes.push({ path: "/editor", element: withLayout(EditorPage) });
}

export const router = createBrowserRouter(routes);
