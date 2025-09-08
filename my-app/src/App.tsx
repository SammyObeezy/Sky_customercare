import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import Footer from './components/Footer/Footer';
import TicketList from './pages/TicketList/TicketList';
import AddTicket from './pages/AddTicket/AddTicket';
import './App.css';

const App: React.FC = () => {
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
};

export default App;