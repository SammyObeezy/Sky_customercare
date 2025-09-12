import React from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useUser } from '../contexts/UserContext';

const UnauthenticatedLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  React.useEffect(() => {
    // **Only redirect if loading is finished AND the user IS authenticated**
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/', replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // **While the auth check is running, don't render anything**
  if (isLoading) {
    return null;
  }
  
  return <Outlet />;
};

export const Route = createFileRoute('/_unauthenticated')({
  component: UnauthenticatedLayout,
});