import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

// User interface
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

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Registration data interface
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// Updated context interface
interface UserContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Legacy properties (keeping for compatibility)
  userType: 'admin' | 'client';
  companyName: string;
  setUserType: (type: 'admin' | 'client') => void;
  setCompanyName: (name: string) => void;
  
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  
  // Utility methods
  getAllUsers: () => User[];
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

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

// Default admin user for testing
const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@helpdesk.com',
  phoneNumber: '+254700000000',
  password: 'Admin@123',
  userType: 'admin',
  companyName: 'Sky World Limited',
  createdAt: new Date().toISOString()
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+\d{1,3}\d{9,14}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password: string): boolean => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name.trim());
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Legacy state (keeping for compatibility)
  const [userType, setUserType] = useState<'admin' | 'client'>('admin');
  const [companyName, setCompanyName] = useState('Sky World Limited');

  // Initialize users in localStorage if not exists
  const initializeUsers = () => {
    const existingUsers = localStorage.getItem('helpdesk_users');
    if (!existingUsers) {
      localStorage.setItem('helpdesk_users', JSON.stringify([DEFAULT_ADMIN]));
    }
  };

  // Get all users from localStorage
  const getAllUsers = (): User[] => {
    try {
      const users = localStorage.getItem('helpdesk_users');
      return users ? JSON.parse(users) : [DEFAULT_ADMIN];
    } catch (error) {
      console.error('Error getting users:', error);
      return [DEFAULT_ADMIN];
    }
  };

  // Save users to localStorage
  const saveUsers = (users: User[]): void => {
    try {
      localStorage.setItem('helpdesk_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('helpdesk_current_user');
        const rememberMe = localStorage.getItem('helpdesk_remember_me') === 'true';
        
        if (storedUser && rememberMe) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setUserType(userData.userType);
          setCompanyName(userData.companyName);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUsers();
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      // Validate input
      if (!validateEmail(credentials.email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      if (!credentials.password) {
        return { success: false, message: 'Password is required' };
      }

      // Get users and find matching user
      const users = getAllUsers();
      const foundUser = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
      );

      if (!foundUser) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Set user state
      setUser(foundUser);
      setIsAuthenticated(true);
      setUserType(foundUser.userType);
      setCompanyName(foundUser.companyName);

      // Store in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('helpdesk_current_user', JSON.stringify(foundUser));
        localStorage.setItem('helpdesk_remember_me', 'true');
      } else {
        localStorage.removeItem('helpdesk_current_user');
        localStorage.removeItem('helpdesk_remember_me');
      }

      return { success: true, message: 'Login successful' };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      // Validate input
      if (!validateName(userData.firstName)) {
        return { success: false, message: 'First name must be at least 2 characters and contain only letters' };
      }

      if (!validateName(userData.lastName)) {
        return { success: false, message: 'Last name must be at least 2 characters and contain only letters' };
      }

      if (!validateEmail(userData.email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      if (!validatePhone(userData.phoneNumber)) {
        return { success: false, message: 'Phone number must start with + and be in international format (e.g., +254712345678)' };
      }

      if (!validatePassword(userData.password)) {
        return { success: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' };
      }

      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Check if user already exists
      const users = getAllUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

      if (existingUser) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        phoneNumber: userData.phoneNumber.trim(),
        password: userData.password,
        userType: 'client', // New users are clients by default
        companyName: 'Sky World Limited',
        createdAt: new Date().toISOString()
      };

      // Save user
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);

      // Auto-login the new user
      setUser(newUser);
      setIsAuthenticated(true);
      setUserType(newUser.userType);
      setCompanyName(newUser.companyName);

      // Store in localStorage
      localStorage.setItem('helpdesk_current_user', JSON.stringify(newUser));
      localStorage.setItem('helpdesk_remember_me', 'true');

      return { success: true, message: 'Account created successfully' };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType('admin');
    setCompanyName('Sky World Limited');
    
    // Clear localStorage
    localStorage.removeItem('helpdesk_current_user');
    localStorage.removeItem('helpdesk_remember_me');
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      const users = getAllUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // For security, we don't reveal if email exists
        return { success: true, message: 'If an account with this email exists, reset instructions have been sent' };
      }

      // In a real app, this would send an email
      // For now, we'll just simulate success
      console.log(`Password reset requested for: ${email}`);
      
      return { success: true, message: 'If an account with this email exists, reset instructions have been sent' };

    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'An error occurred while processing your request' };
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'No user logged in' };
      }

      const users = getAllUsers();
      const userIndex = users.findIndex(u => u.id === user.id);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      // Update user
      const updatedUser = { ...user, ...updates };
      users[userIndex] = updatedUser;

      // Save and update state
      saveUsers(users);
      setUser(updatedUser);
      
      // Update localStorage if user is remembered
      const rememberMe = localStorage.getItem('helpdesk_remember_me') === 'true';
      if (rememberMe) {
        localStorage.setItem('helpdesk_current_user', JSON.stringify(updatedUser));
      }

      return { success: true, message: 'Profile updated successfully' };

    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'An error occurred while updating profile' };
    }
  };

  const value: UserContextType = {
    // User state
    user,
    isAuthenticated,
    isLoading,
    
    // Legacy properties
    userType,
    companyName,
    setUserType,
    setCompanyName,
    
    // Authentication methods
    login,
    register,
    logout,
    forgotPassword,
    
    // Utility methods
    getAllUsers,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};