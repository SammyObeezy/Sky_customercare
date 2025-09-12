// src/routes/__root.tsx
import React from 'react';
// 1. Import Link for the notFoundComponent
import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
// 2. Import devtools from the new, correct package
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { SidebarProvider } from '../contexts/SidebarContext';
import { UserProvider, useUser } from '../contexts/UserContext';
import { EditorProvider } from '../contexts/EditorContext';
import { TicketsProvider } from '../contexts/TicketsContext';

// The main component that now handles the loading screen
function Root() {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

// The component that provides all the contexts
function AppProviders() {
  return (
    <UserProvider>
      <SidebarProvider>
        <TicketsProvider>
          <EditorProvider>
            <Root />
          </EditorProvider>
        </TicketsProvider>
      </SidebarProvider>
    </UserProvider>
  );
}

export const Route = createRootRoute({
  component: AppProviders,
  // 3. Add the notFoundComponent to handle errors gracefully
  notFoundComponent: () => {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Page Not Found!</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Go Home
        </Link>
      </div>
    );
  },
});