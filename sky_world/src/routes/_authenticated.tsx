import React from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useUser } from '../contexts/UserContext';
import NavBar from '../components/NavBar/NavBar';
import SideBar from '../components/SideBar/SideBar';
import Footer from '../components/Footer/Footer';

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  React.useEffect(() => {
    // **Only redirect if loading is finished AND the user is not authenticated**
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login', replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // **While the auth check is running, don't render anything**
  if (isLoading) {
    return null;
  }

  // If loading is done, render the layout
  return (
    <div className="app">
      <NavBar />
      <div className="app-body">
        <SideBar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});