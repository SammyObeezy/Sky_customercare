import React from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useUser } from '../contexts/UserContext';

const UnauthenticatedLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/', replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

// FIXED: Removed the path string argument
export const Route = createFileRoute('/_unauthenticated')({
  component: UnauthenticatedLayout,
});