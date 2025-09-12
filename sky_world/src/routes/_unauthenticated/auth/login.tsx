// src/routes/_unauthenticated/auth/login.tsx

import React, { useState } from 'react';
// 1. Updated imports for TanStack Router
import { Link, createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../contexts/UserContext';
import './styles.css'; // Path to the CSS file we moved

// 2. Added route definition
// export const Route = createFileRoute('/_unauthenticated/auth/login')({
//   component: Login,
// })

export const Route = createFileRoute('/_unauthenticated/auth/login')({
  component: Login,
});


interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function Login() {
  const { login } = useUser();
  
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
    
    // Clear errors when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', formData);
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, should redirect now');
        // The redirect will happen automatically via the _unauthenticated.tsx layout route
      } else {
        console.log('Login failed:', result.message);
        setErrors({ email: result.message });
      }
    } catch (error) {
      console.log('Login error:', error);
      setErrors({ email: 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left side - Image/Branding */}
      <div className="auth-image-section">
        <div className="auth-brand">
          <h1>Help Desk</h1>
          <p>Streamline your support workflow</p>
        </div>
      </div>

      {/* Right side - Login Form */}
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
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
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
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
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
              {/* 3. Updated link path */}
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
              {/* 3. Updated link path */}
              <p>Don't have an account? <Link to="/auth/register">Sign up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};