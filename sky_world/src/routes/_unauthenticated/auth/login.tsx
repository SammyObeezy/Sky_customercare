// src/routes/_unauthenticated/auth/login.tsx

import React, { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../contexts/UserContext';
import './styles.css';

// FIXED: Removed the incorrect path argument
export const Route = createFileRoute('/_unauthenticated/auth/login')({
  component: Login,
});

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function Login() {
  const { login, validateFieldRealTime, fieldStates } = useUser();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Real-time validation for non-checkbox fields
    if (name !== 'rememberMe') {
      validateFieldRealTime(name, value, name === 'email' ? 'email' : 'password');
    }

    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect is handled automatically by the layout route
        console.log('Login successful');
      } else if (result.errors) {
        // FIXED: Set the new errors object to display per-field validation
        setErrors(result.errors);
      }
    } catch (error) {
      console.log('Login error:', error);
      setErrors({ email: 'An unknown error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image-section">
        <div className="auth-brand">
          <h1>Help Desk</h1>
          <p>Streamline your support workflow</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : fieldStates.email?.status || ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
              {fieldStates.email?.status === 'valid' && <span className="success-message">{fieldStates.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : fieldStates.password?.status || ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              {fieldStates.password?.status === 'valid' && <span className="success-message">{fieldStates.password.message}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/auth/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-btn primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/auth/register">Sign up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};