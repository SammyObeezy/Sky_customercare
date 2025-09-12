import React from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useUser } from '../contexts/UserContext';
import NavBar from '../components/NavBar/NavBar';
import SideBar from '../components/SideBar/SideBar';
import Footer from '../components/Footer/Footer';

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/auth/login', replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
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

// FIXED: Removed the path string argument
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});