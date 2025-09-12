// src/routes/_unauthenticated/auth/forgot-password.tsx

import React, { useState } from 'react';
// 1. Changed from 'react-router-dom'
import { Link, createFileRoute } from '@tanstack/react-router';
import './styles.css'; // Path to the CSS file we moved

// 2. Added route definition
// export const Route = createFileRoute('/_unauthenticated/auth/forgot-password')({
//   component: ForgotPassword,
// })
export const Route = createFileRoute('/_unauthenticated/auth/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="auth-container">
      <div className="auth-image-section">
        <div className="auth-brand">
          <h1>Reset Password</h1>
          <p>We'll help you get back to your account</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          {!isSubmitted ? (
            <>
              <div className="auth-header">
                <h2>Forgot Password?</h2>
                <p>Enter your email address and we'll send you instructions to reset your password</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="auth-btn primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>

                <div className="auth-footer">
                  {/* 3. Updated link path */}
                  <p>Remember your password? <Link to="/auth/login">Sign in</Link></p>
                </div>
              </form>
            </>
          ) : (
            <div className="auth-success">
              <h2>Check Your Email</h2>
              <p>We've sent password reset instructions to <strong>{email}</strong></p>
              <p>Didn't receive the email? Check your spam folder or contact support.</p>
              {/* 3. Updated link path */}
              <Link to="/auth/login" className="auth-btn secondary">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};