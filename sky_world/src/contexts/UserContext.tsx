import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { AES, SHA256, enc } from 'crypto-js';

// --- Interfaces (keep existing + add new) ---
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string; 
  userType: 'admin' | 'client';
  companyName: string;
  createdAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

type ValidationResult = { 
  success: boolean; 
  message?: string; 
  errors?: any;
};

// NEW: Field validation state
interface FieldState {
  status: 'idle' | 'valid' | 'error' | 'warning';
  message: string;
  isValid: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: 'admin' | 'client';
  companyName: string;
  setUserType: (type: 'admin' | 'client') => void;
  setCompanyName: (name: string) => void;
  login: (credentials: LoginCredentials) => Promise<ValidationResult>;
  register: (userData: RegisterData) => Promise<ValidationResult>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  getAllUsers: () => User[];
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  
  // NEW: Real-time validation methods
  validateFieldRealTime: (fieldName: string, value: string, type: string) => FieldState;
  getPasswordStrength: (password: string) => { level: string; score: number };
  fieldStates: Record<string, FieldState>;
  setFieldState: (fieldName: string, state: FieldState) => void;
  clearFieldStates: () => void;
}

// --- Keep existing encryption setup ---
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("Missing VITE_CRYPTO_SECRET_KEY in .env file");
}

const encryptData = (data: object): string => {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext: string | null): any => {
  if (!ciphertext) return null;
  try {
    const bytes = AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Keep existing validation functions
const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string): boolean => /^\+\d{1,3}\d{9,14}$/.test(phone);
const validatePassword = (password: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
const validateName = (name: string): boolean => /^[a-zA-Z\s]{2,}$/.test(name.trim());

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Keep all existing state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'admin' | 'client'>('admin');
  const [companyName, setCompanyName] = useState('Sky World Limited');
  
  // NEW: Add field validation state
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});

  // Keep existing DEFAULT_ADMIN
  const DEFAULT_ADMIN: User = {
    id: 'admin-001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@helpdesk.com',
    phoneNumber: '+254700000000',
    password: SHA256('Admin@123').toString(),
    userType: 'admin',
    companyName: 'Sky World Limited',
    createdAt: new Date().toISOString()
  };

  // Keep existing getAllUsers and saveUsers
  const getAllUsers = (): User[] => {
    const encryptedUsers = localStorage.getItem('helpdesk_users');
    const users = decryptData(encryptedUsers);
    return users || [];
  };

  const saveUsers = (users: User[]): void => {
    const encryptedUsers = encryptData(users);
    localStorage.setItem('helpdesk_users', encryptedUsers);
  };

  // NEW: Password strength analysis
  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 'idle', score: 0 };

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[@$!%*?&]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;

    if (score < 2) return { level: 'weak', score };
    if (score < 3) return { level: 'fair', score };
    if (score < 4) return { level: 'good', score };
    return { level: 'strong', score };
  };

  // NEW: Real-time field validation
  const validateFieldRealTime = (fieldName: string, value: string, type: string): FieldState => {
    if (!value || value.trim() === '') {
      const emptyState: FieldState = { status: 'idle', message: '', isValid: false };
      setFieldStates(prev => ({ ...prev, [fieldName]: emptyState }));
      return emptyState;
    }

    let isValid = false;
    let message = '';
    let status: 'idle' | 'valid' | 'error' | 'warning' = 'idle';

    switch (type) {
      case 'email':
        isValid = validateEmail(value);
        status = isValid ? 'valid' : 'error';
        message = isValid ? 'Valid email address' : 'Please enter a valid email address';
        
        // Check if email exists (for registration)
        if (isValid && fieldName !== 'loginEmail') {
          const users = getAllUsers();
          const emailExists = users.some(u => u.email.toLowerCase() === value.toLowerCase());
          if (emailExists) {
            isValid = false;
            status = 'error';
            message = 'An account with this email already exists';
          }
        }
        break;

      case 'name':
        isValid = validateName(value);
        status = isValid ? 'valid' : 'error';
        message = isValid ? 'Valid name' : 'Name must be at least 2 letters';
        break;

      case 'phone':
        isValid = validatePhone(value);
        status = isValid ? 'valid' : 'error';
        message = isValid ? 'Valid phone number' : 'Use international format (e.g., +254...)';
        break;

      case 'password':
        const strength = getPasswordStrength(value);
        isValid = strength.score >= 4;
        
        if (strength.score >= 4) {
          status = 'valid';
          message = 'Strong password';
        } else if (strength.score >= 2) {
          status = 'warning';
          message = 'Password could be stronger';
        } else {
          status = 'error';
          message = 'Password is too weak';
        }
        break;

      case 'confirmPassword':
        const mainPasswordState = fieldStates.password;
        const mainPasswordValue = mainPasswordState ? 
          (document.querySelector('input[name="password"]') as HTMLInputElement)?.value || '' : '';
        isValid = value === mainPasswordValue;
        status = isValid ? 'valid' : 'error';
        message = isValid ? 'Passwords match' : 'Passwords do not match';
        break;

      default:
        status = 'idle';
        message = '';
        isValid = false;
    }

    const fieldState: FieldState = { status, message, isValid };
    setFieldStates(prev => ({ ...prev, [fieldName]: fieldState }));
    return fieldState;
  };

  // NEW: Helper methods
  const setFieldState = (fieldName: string, state: FieldState): void => {
    setFieldStates(prev => ({ ...prev, [fieldName]: state }));
  };

  const clearFieldStates = (): void => {
    setFieldStates({});
  };

  // Keep existing useEffect
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const encryptedUser = localStorage.getItem('helpdesk_current_user');
        const userData = decryptData(encryptedUser);

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          setUserType(userData.userType);
          setCompanyName(userData.companyName);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!localStorage.getItem('helpdesk_users')) {
      saveUsers([DEFAULT_ADMIN]);
    }
    checkAuthStatus();
  }, []);

  // Keep ALL existing methods exactly the same (login, register, etc.)
  const login = async (credentials: LoginCredentials): Promise<ValidationResult> => {
    const errors: Partial<LoginCredentials> = {};

    if (!validateEmail(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!credentials.password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const hashedPassword = SHA256(credentials.password).toString();
    const users = getAllUsers();
    const foundUser = users.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === hashedPassword
    );

    if (!foundUser) {
      return { success: false, errors: { email: 'Invalid email or password' } };
    }

    setUser(foundUser);
    setIsAuthenticated(true);
    setUserType(foundUser.userType);
    setCompanyName(foundUser.companyName);
    
    localStorage.setItem('helpdesk_current_user', encryptData(foundUser));
    localStorage.setItem('helpdesk_remember_me', 'true');

    return { success: true, message: 'Login successful' };
  };

  const register = async (userData: RegisterData): Promise<ValidationResult> => {
    const errors: Partial<RegisterData> = {};

    if (!validateName(userData.firstName)) errors.firstName = 'First name must be at least 2 letters';
    if (!validateName(userData.lastName)) errors.lastName = 'Last name must be at least 2 letters';
    if (!validateEmail(userData.email)) errors.email = 'Please enter a valid email';
    if (!validatePhone(userData.phoneNumber)) errors.phoneNumber = 'Use international format (e.g., +254...)';
    if (!validatePassword(userData.password)) errors.password = 'Min 8 chars, with uppercase, number, & symbol';
    if (userData.password !== userData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    const users = getAllUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      errors.email = 'An account with this email already exists';
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.toLowerCase().trim(),
      phoneNumber: userData.phoneNumber.trim(),
      password: SHA256(userData.password).toString(),
      userType: 'client',
      companyName: 'Sky World Limited',
      createdAt: new Date().toISOString()
    };
    
    saveUsers([...users, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);
    setUserType(newUser.userType);
    setCompanyName(newUser.companyName);

    localStorage.setItem('helpdesk_current_user', encryptData(newUser));
    localStorage.setItem('helpdesk_remember_me', 'true');

    return { success: true, message: 'Account created successfully' };
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    clearFieldStates();
    localStorage.removeItem('helpdesk_current_user');
    localStorage.removeItem('helpdesk_remember_me');
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!validateEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }
    const users = getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: true, message: 'If an account with this email exists, reset instructions have been sent' };
    }
    console.log(`Password reset requested for: ${email}`);
    return { success: true, message: 'If an account with this email exists, reset instructions have been sent' };
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No user logged in' };
    }
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    saveUsers(users);
    setUser(updatedUser);
    
    localStorage.setItem('helpdesk_current_user', encryptData(updatedUser));
    
    return { success: true, message: 'Profile updated successfully' };
  };

  const value: UserContextType = {
    // Keep all existing exports
    user,
    isAuthenticated,
    isLoading,
    userType,
    companyName,
    setUserType,
    setCompanyName,
    login,
    register,
    logout,
    forgotPassword,
    getAllUsers,
    updateProfile,
    
    // NEW: Add validation methods
    validateFieldRealTime,
    getPasswordStrength,
    fieldStates,
    setFieldState,
    clearFieldStates
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};