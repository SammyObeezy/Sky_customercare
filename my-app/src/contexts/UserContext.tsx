import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userType: 'admin' | 'client';
  companyName: string;
  setUserType: (type: 'admin' | 'client') => void;
  setCompanyName: (name: string) => void;
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

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userType, setUserType] = useState<'admin' | 'client'>('admin');
  const [companyName, setCompanyName] = useState('Sky World Limited');

  return (
    <UserContext.Provider value={{ userType, companyName, setUserType, setCompanyName }}>
      {children}
    </UserContext.Provider>
  );
};