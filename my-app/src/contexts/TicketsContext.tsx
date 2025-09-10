import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Ticket {
  id: number;
  ticketSubject: string;
  ticketStatus: string;
  source: string;
  dateRequested: string;
  mainCategory: string;
  subCategory: string;
  problemIssue: string;
  description: string;
  attachments: any[];
}

interface CreateTicketData {
  mainCategory: string;
  subCategory: string;
  problemIssue: string;
  description: string;
  attachments: any[];
}

interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (ticketData: CreateTicketData) => void;
  getTicketCounts: () => Record<string, number>;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

// Initial mock data
const initialTickets: Ticket[] = [
  {
    id: 1,
    ticketSubject: 'Addition of Guarantors to Loan Module',
    ticketStatus: 'Open',
    source: 'Email',
    dateRequested: '2024-05-06 12:00:00',
    mainCategory: 'Sky Portal',
    subCategory: 'User Administration',
    problemIssue: 'Add Feature',
    description: 'Request to add guarantor functionality',
    attachments: []
  },
  {
    id: 2,
    ticketSubject: 'Reset Password',
    ticketStatus: 'Resolved',
    source: 'Email',
    dateRequested: '2024-05-07 12:00:00',
    mainCategory: 'Sky Portal',
    subCategory: 'User Administration',
    problemIssue: 'Password Issue',
    description: 'User unable to login',
    attachments: []
  },
  {
    id: 3,
    ticketSubject: 'Portal Rights Requisition',
    ticketStatus: 'Closed',
    source: 'Email',
    dateRequested: '2024-05-08 12:00:00',
    mainCategory: 'Sky Portal',
    subCategory: 'Access Rights',
    problemIssue: 'Permission Request',
    description: 'Request for additional portal access',
    attachments: []
  },
  {
    id: 4,
    ticketSubject: 'Addition of SHA Insurance',
    ticketStatus: 'In Progress',
    source: 'Help Desk System',
    dateRequested: '2024-05-10 12:00:00',
    mainCategory: 'Insurance',
    subCategory: 'SHA',
    problemIssue: 'Add Feature',
    description: 'Request to add SHA insurance module',
    attachments: []
  }
];

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const addTicket = (ticketData: CreateTicketData) => {
    const newTicket: Ticket = {
      id: Math.max(...tickets.map(t => t.id), 0) + 1,
      ticketSubject: ticketData.problemIssue || 'New Ticket',
      ticketStatus: 'Open',
      source: 'Help Desk System',
      dateRequested: new Date().toISOString().replace('T', ' ').slice(0, 19),
      mainCategory: ticketData.mainCategory,
      subCategory: ticketData.subCategory,
      problemIssue: ticketData.problemIssue,
      description: ticketData.description,
      attachments: ticketData.attachments
    };
    
    setTickets(prev => [...prev, newTicket]);
  };

  const getTicketCounts = () => {
    const counts = tickets.reduce((acc, ticket) => {
      const status = ticket.ticketStatus.toLowerCase().replace(' ', '-');
      acc[status] = (acc[status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return counts;
  };

  return (
    <TicketsContext.Provider value={{ tickets, addTicket, getTicketCounts }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
};