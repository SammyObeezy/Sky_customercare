// src/routes/_authenticated/index.tsx
import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

// Define the route for the root path '/'
export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>Dashboard</h1>
        </div>
        <hr className="page-divider" />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Welcome to your dashboard!</h2>
        <p>This is the new main page. You can add summary widgets and charts here.</p>
        <p>
          Your tickets are now located at the{' '}
          <Link to="/ticket-list" style={{ color: 'blue', textDecoration: 'underline' }}>
            Ticket List
          </Link>{' '}
          page.
        </p>
      </div>
    </div>
  );
}