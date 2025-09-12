// src/routes/_authenticated/ticket/$ticketId.tsx

import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTickets } from '../../../contexts/TicketsContext';
import './styles.css';

export const Route = createFileRoute('/_authenticated/ticket/$ticketId')({
  component: TicketDetailsPage,
});

function TicketDetailsPage() {
  const { tickets } = useTickets();
  const { ticketId: encodedId } = Route.useParams();
  
  let ticket = null;

  try {
    const decodedId = atob(encodedId);
    ticket = tickets.find(t => t.id.toString() === decodedId);
  } catch (error) {
    console.error("Failed to decode ticket ID or find ticket:", error);
  }

  if (!ticket) {
    return (
      <div className="ticket-not-found">
        <h2>Ticket Not Found</h2>
        <p>Sorry, we could not find a ticket with that ID.</p>
        <Link to="/ticket-list" className="back-link">
          &larr; Back to Ticket List
        </Link>
      </div>
    );
  }

  return (
    <div className="ticket-details-page">
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>Ticket #{ticket.id}</h1>
          <p className="ticket-subject-header">Subject: {ticket.ticketSubject}</p>
        </div>
        <hr className="page-divider" />
      </div>

      {/* LINK MOVED TO HERE */}
      <Link to="/ticket-list" className="back-link">
        &larr; Back to Ticket List
      </Link>

      <div className="ticket-details-content">
        <p><strong>Status:</strong> {ticket.ticketStatus}</p>
        <p><strong>Source:</strong> {ticket.source}</p>
        <p><strong>Date Requested:</strong> {new Date(ticket.dateRequested).toLocaleString()}</p>
        <hr />
        <h3>Description</h3>
        <div dangerouslySetInnerHTML={{ __html: ticket.description }} />
      </div>
    </div>
  );
}