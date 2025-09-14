// src/routes/_unauthenticated/auth/forgot-password.tsx
import React, { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../contexts/UserContext';
import './styles.css';

// FIXED: Removed the incorrect path argument
export const Route = createFileRoute('/_unauthenticated/auth/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  const { forgotPassword, validateFieldRealTime, fieldStates } = useUser();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for validation errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors
    
    // Call the actual function from the context
    const result = await forgotPassword(email);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateFieldRealTime('forgotEmail', e.target.value, 'email' as string);
                    }}
                    placeholder="Enter your email"
                    className={error ? 'error' : fieldStates.forgotEmail?.status || ''}
                    required
                  />
                  {error && <span className="error-message">{error}</span>}
                  {fieldStates.forgotEmail?.status === 'valid' && <span className="success-message">{fieldStates.forgotEmail.message}</span>}
                </div>
                
                <button
                  type="submit"
                  className="auth-btn primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
                
                <div className="auth-footer">
                  <p>Remember your password? <Link to="/auth/login">Sign in</Link></p>
                </div>
              </form>
            </>
          ) : (
            <div className="auth-success">
              <h2>Check Your Email</h2>
              <p>We've sent password reset instructions to <strong>{email}</strong></p>
              <p>Didn't receive the email? Check your spam folder or contact support.</p>
              <Link to="/auth/login" className="auth-btn secondary">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};