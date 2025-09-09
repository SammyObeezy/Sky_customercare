import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { UserProvider } from './contexts/UserContext';
import { EditorProvider } from './contexts/EditorContext';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import Footer from './components/Footer/Footer';
import TicketList from './pages/TicketList/TicketList';
import AddTicket from './pages/AddTicket/AddTicket';
import './App.css';

const App: React.FC = () => {
  return (
    <UserProvider>
      <SidebarProvider>
        <EditorProvider>
          <Router>
            <div className="app">
              <NavBar />
              <div className="app-body">
                <SideBar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<TicketList />} />
                    <Route path="/tickets" element={<TicketList />} />
                    <Route path="/add-ticket" element={<AddTicket />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </Router>
        </EditorProvider>
      </SidebarProvider>
    </UserProvider>
  );
};

export default App;