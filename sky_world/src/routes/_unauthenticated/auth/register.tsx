// src/routes/_unauthenticated/auth/register.tsx

import React, { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../contexts/UserContext';
import './styles.css';

// FIXED: Removed the incorrect path argument
export const Route = createFileRoute('/_unauthenticated/auth/register')({
  component: Register,
});

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const { register, validateFieldRealTime, fieldStates, getPasswordStrength } = useUser();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation with proper TypeScript typing
    let validationType = 'name';
    if (name === 'email') validationType = 'email';
    else if (name === 'phoneNumber') validationType = 'phone';
    else if (name === 'password') validationType = 'password';
    else if (name === 'confirmPassword') validationType = 'confirmPassword';

    validateFieldRealTime(name, value, validationType as string);

    if (errors[name as keyof RegisterFormData]) {
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
      const result = await register(formData);

      if (result.success) {
        // Redirect is handled automatically
        console.log('Registration successful');
      } else if (result.errors) {
        // FIXED: Set the new errors object to display per-field validation
        setErrors(result.errors);
      }
    } catch (error) {
      console.log('Registration error:', error);
      setErrors({ email: 'An unknown error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image-section">
        <div className="auth-brand">
          <h1>Join Our Team</h1>
          <p>Create your account to get started</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Fill in your details to register</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className={errors.firstName ? 'error' : fieldStates.firstName?.status || ''}
                  disabled={isLoading}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                {fieldStates.firstName?.status === 'valid' && <span className="success-message">{fieldStates.firstName.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className={errors.lastName ? 'error' : fieldStates.lastName?.status || ''}
                  disabled={isLoading}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                {fieldStates.lastName?.status === 'valid' && <span className="success-message">{fieldStates.lastName.message}</span>}
              </div>
            </div>

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
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+254712345678"
                className={errors.phoneNumber ? 'error' : fieldStates.phoneNumber?.status || ''}
                disabled={isLoading}
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              {fieldStates.phoneNumber?.status === 'valid' && <span className="success-message">{fieldStates.phoneNumber.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                className={errors.password ? 'error' : fieldStates.password?.status || ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              {fieldStates.password?.status === 'valid' && <span className="success-message">{fieldStates.password.message}</span>}
              
              {/* Password Strength Indicator - MOVED TO CORRECT LOCATION */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill ${getPasswordStrength(formData.password).level}`}></div>
                  </div>
                  <div className={`strength-text ${getPasswordStrength(formData.password).level}`}>
                    Password strength: {getPasswordStrength(formData.password).level}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : fieldStates.confirmPassword?.status || ''}
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              {fieldStates.confirmPassword?.status === 'valid' && <span className="success-message">{fieldStates.confirmPassword.message}</span>}
            </div>

            <button
              type="submit"
              className="auth-btn primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/auth/login">Sign in</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};