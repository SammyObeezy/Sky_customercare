import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { EditorProvider } from './contexts/EditorContext';
import { TicketsProvider } from './contexts/TicketsContext';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import Footer from './components/Footer/Footer';
import TicketList from './pages/TicketList/TicketList';
import AddTicket from './pages/AddTicket/AddTicket';
import OData from './pages/OData/OData';
import { Login, Register, ForgotPassword } from './pages/Auth';
import './App.css';

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Authenticated App Layout
const AuthenticatedApp: React.FC = () => {
  return (
    <SidebarProvider>
      <TicketsProvider>
        <EditorProvider>
          <div className="app">
            <NavBar />
            <div className="app-body">
              <SideBar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<TicketList />} />
                  <Route path="/tickets" element={<TicketList />} />
                  <Route path="/add-ticket" element={<AddTicket />} />
                  <Route path="/odata" element={<OData />} />
                  {/* Redirect any auth routes back to dashboard when authenticated */}
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/register" element={<Navigate to="/" replace />} />
                  <Route path="/forgot-password" element={<Navigate to="/" replace />} />
                  {/* Catch all other routes and redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </EditorProvider>
      </TicketsProvider>
    </SidebarProvider>
  );
};

// Unauthenticated App Layout (Auth Pages Only)
const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Redirect any other routes to login when not authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Router Component
const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useUser();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render appropriate app based on authentication status
  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

// Main App Component
const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <AppRouter />
      </Router>
    </UserProvider>
  );
};

export default App;