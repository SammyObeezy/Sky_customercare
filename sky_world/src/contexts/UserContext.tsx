import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { AES, SHA256, enc } from 'crypto-js';

// --- Interfaces ---
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
}

// --- Encryption and Hashing Setup ---
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

// Validation functions
const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string): boolean => /^\+\d{1,3}\d{9,14}$/.test(phone);
const validatePassword = (password: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
const validateName = (name: string): boolean => /^[a-zA-Z\s]{2,}$/.test(name.trim());


export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'admin' | 'client'>('admin');
  const [companyName, setCompanyName] = useState('Sky World Limited');

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

  const getAllUsers = (): User[] => {
    const encryptedUsers = localStorage.getItem('helpdesk_users');
    const users = decryptData(encryptedUsers);
    return users || [];
  };

  const saveUsers = (users: User[]): void => {
    const encryptedUsers = encryptData(users);
    localStorage.setItem('helpdesk_users', encryptedUsers);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const encryptedUser = localStorage.getItem('helpdesk_current_user');
        const userData = decryptData(encryptedUser);

        // We always "remember" the user now, so we don't need to check the flag
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
    
    // **FIXED**: Always save the session to localStorage, regardless of the checkbox.
    localStorage.setItem('helpdesk_current_user', encryptData(foundUser));
    localStorage.setItem('helpdesk_remember_me', 'true'); // Keep this for the checkAuthStatus logic

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
    
    // Always update the encrypted session data
    localStorage.setItem('helpdesk_current_user', encryptData(updatedUser));
    
    return { success: true, message: 'Profile updated successfully' };
  };

  const value: UserContextType = {
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
    updateProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};