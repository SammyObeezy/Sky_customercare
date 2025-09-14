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
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login', replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return null;
  }
  
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