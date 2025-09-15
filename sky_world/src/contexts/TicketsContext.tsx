import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

// NEW: Define a storable shape for attachments
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface Ticket {
  id: number;
  ticketSubject: string;
  ticketStatus: string;
  source: string;
  dateRequested: string;
  mainCategory: string;
  subCategory: string;
  problemIssue: string;
  description: string;
  attachments: Attachment[];
}

interface CreateTicketData {
  mainCategory: string;
  subCategory: string;
  problemIssue: string;
  description: string;
  attachments: { id: string, name: string, file: File }[]; // Type for incoming data
}

interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (ticketData: CreateTicketData) => Promise<void>;
  getTicketCounts: () => Record<string, number>;
  updateTicket: (ticketId: number, updates: Partial<Ticket>) => void; // Add this line
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

const initialTickets: Ticket[] = [
  {
    id: 1,
    ticketSubject: 'Addition of Guarantors to Loan Module',
    ticketStatus: 'Open',
    source: 'Email',
    dateRequested: '2024-05-06T12:00:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'User Administration',
    problemIssue: 'Add Feature',
    description: 'Request to add guarantor functionality',
    attachments: []
  },
  {
    id: 2,
    ticketSubject: 'Reset Password for Client Account',
    ticketStatus: 'Resolved',
    source: 'Email',
    dateRequested: '2024-05-07T12:00:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'User Administration',
    problemIssue: 'Password Issue',
    description: 'User unable to login',
    attachments: []
  },
  {
    id: 3,
    ticketSubject: 'Portal Rights Requisition for New Intern',
    ticketStatus: 'Closed',
    source: 'Email',
    dateRequested: '2024-05-08T12:00:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'Access Rights',
    problemIssue: 'Permission Request',
    description: 'Request for additional portal access',
    attachments: []
  },
  {
    id: 4,
    ticketSubject: 'Addition of SHA Insurance Module',
    ticketStatus: 'In Progress',
    source: 'Help Desk System',
    dateRequested: '2024-05-10T12:00:00Z',
    mainCategory: 'Insurance',
    subCategory: 'SHA',
    problemIssue: 'Add Feature',
    description: 'Request to add SHA insurance module',
    attachments: []
  },
  {
    id: 5,
    ticketSubject: 'Cannot Generate Monthly Statement',
    ticketStatus: 'Open',
    source: 'Phone Call',
    dateRequested: '2024-06-11T09:30:00Z',
    mainCategory: 'Reporting',
    subCategory: 'Statements',
    problemIssue: 'Bug Report',
    description: 'The system hangs when trying to generate the monthly financial statement.',
    attachments: []
  },
  {
    id: 6,
    ticketSubject: 'UI Glitch on Dashboard Widget',
    ticketStatus: 'In Progress',
    source: 'Help Desk System',
    dateRequested: '2024-06-12T15:00:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'Dashboard',
    problemIssue: 'UI Bug',
    description: 'The main revenue chart is not displaying the correct labels.',
    attachments: []
  },
  {
    id: 7,
    ticketSubject: 'Export to CSV Fails for Large Datasets',
    ticketStatus: 'On Hold',
    source: 'Email',
    dateRequested: '2024-06-14T11:00:00Z',
    mainCategory: 'Reporting',
    subCategory: 'Data Export',
    problemIssue: 'Performance Issue',
    description: 'Exporting more than 10,000 records results in a server timeout. Awaiting server upgrade.',
    attachments: []
  },
  {
    id: 8,
    ticketSubject: 'Update Company Logo in Portal',
    ticketStatus: 'Resolved',
    source: 'Help Desk System',
    dateRequested: '2024-07-01T10:00:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'Branding',
    problemIssue: 'Change Request',
    description: 'Please update the company logo in the navbar and footer.',
    attachments: []
  },
  {
    id: 9,
    ticketSubject: 'Two-Factor Authentication (2FA) Setup',
    ticketStatus: 'Open',
    source: 'Email',
    dateRequested: '2024-07-05T14:20:00Z',
    mainCategory: 'Security',
    subCategory: 'Authentication',
    problemIssue: 'Feature Request',
    description: 'We would like to enable 2FA for all admin-level users.',
    attachments: []
  },
  {
    id: 10,
    ticketSubject: 'User Deactivation Request - John Doe',
    ticketStatus: 'Closed',
    source: 'Help Desk System',
    dateRequested: '2024-07-15T16:00:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'User Administration',
    problemIssue: 'Deactivate User',
    description: 'John Doe has left the company. Please deactivate his account.',
    attachments: []
  },
  {
    id: 11,
    ticketSubject: 'Mobile App Crashing on iOS 17.5',
    ticketStatus: 'In Progress',
    source: 'App Store Review',
    dateRequested: '2024-08-01T18:00:00Z',
    mainCategory: 'Mobile App',
    subCategory: 'iOS',
    problemIssue: 'Bug Report',
    description: 'Multiple users reporting that the app crashes on launch after the latest iOS update.',
    attachments: []
  },
  {
    id: 12,
    ticketSubject: 'Incorrect Calculation in Loan Amortization Schedule',
    ticketStatus: 'Dropped',
    source: 'Email',
    dateRequested: '2024-08-03T13:00:00Z',
    mainCategory: 'Loan Module',
    subCategory: 'Calculations',
    problemIssue: 'Bug Report',
    description: 'The interest calculation for the final month is incorrect. User reported they are using a workaround.',
    attachments: []
  },
  {
    id: 13,
    ticketSubject: 'Feature Request: Dark Mode',
    ticketStatus: 'Open',
    source: 'Help Desk System',
    dateRequested: '2024-08-20T11:45:00Z',
    mainCategory: 'Sky Portal',
    subCategory: 'UI/UX',
    problemIssue: 'Feature Request',
    description: 'Request to add a dark mode theme to the user settings.',
    attachments: []
  },
  {
    id: 14,
    ticketSubject: 'API Rate Limit Inquiry',
    ticketStatus: 'Resolved',
    source: 'Email',
    dateRequested: '2024-09-02T17:00:00Z',
    mainCategory: 'API',
    subCategory: 'Integrations',
    problemIssue: 'Question',
    description: 'A third-party developer is asking about the rate limits for our public API.',
    attachments: []
  }
];

// Helper function to convert a File to a Data URL
const convertFileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const storedTickets = localStorage.getItem('helpdesk_tickets');
      if (storedTickets) {
        return JSON.parse(storedTickets);
      }
    } catch (error) {
      console.error("Error parsing tickets from localStorage", error);
    }
    // If nothing in storage, save and return initial data
    localStorage.setItem('helpdesk_tickets', JSON.stringify(initialTickets));
    return initialTickets;
  });

  useEffect(() => {
    try {
      localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error("Error saving tickets to localStorage", error);
    }
  }, [tickets]);

  const addTicket = async (ticketData: CreateTicketData) => {
    const attachmentPromises = ticketData.attachments.map(async (att) => {
      const dataUrl = await convertFileToDataURL(att.file);
      return {
        id: att.id,
        name: att.name,
        type: att.file.type,
        size: att.file.size,
        dataUrl: dataUrl,
      };
    });

    const resolvedAttachments = await Promise.all(attachmentPromises);

    const newTicket: Ticket = {
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      ticketSubject: ticketData.problemIssue,
      ticketStatus: 'Open',
      source: 'Portal',
      dateRequested: new Date().toISOString(),
      mainCategory: ticketData.mainCategory,
      subCategory: ticketData.subCategory,
      problemIssue: ticketData.problemIssue,
      description: ticketData.description,
      attachments: resolvedAttachments,
    };

    setTickets(prevTickets => [...prevTickets, newTicket]);
  };

  // NEW: Function to update an existing ticket
  const updateTicket = (ticketId: number, updates: Partial<Ticket>) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );
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
    <TicketsContext.Provider value={{ tickets, addTicket, getTicketCounts, updateTicket }}>
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

export default TicketsProvider;