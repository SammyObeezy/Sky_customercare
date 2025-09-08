import React from 'react';

// Icon component props interface
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

// Navbar Icons
export const SupportIcon: React.FC<IconProps> = ({ width = 24, height = 24, className, color = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 1C7 1 3 5 3 10V17C3 17.7956 3.31607 18.5587 3.87868 19.1213C4.44129 19.6839 5.20435 20 6 20H9V12H5V10C5 8.14348 5.7375 6.36301 7.05025 5.05025C8.36301 3.7375 10.1435 3 12 3C13.8565 3 15.637 3.7375 16.9497 5.05025C18.2625 6.36301 19 8.14348 19 10V12H15V20H19V21H12V23H18C18.7956 23 19.5587 22.6839 20.1213 22.1213C20.6839 21.5587 21 20.7956 21 20V10C21 5 16.97 1 12 1Z" fill={color}/>
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ width = 24, height = 24, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill={color}/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AddIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const NotificationIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ width = 24, height = 24, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2"/>
  </svg>
);

// Sidebar Icons
export const TicketsIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10,9 9,9 8,9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ReportsIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2"/>
  </svg>
);

export const LayoutIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.75 0H18.25C19.216 0 20 0.784 20 1.75V18.25C20 18.7141 19.8156 19.1592 19.4874 19.4874C19.1592 19.8156 18.7141 20 18.25 20H1.75C1.28587 20 0.840752 19.8156 0.512563 19.4874C0.184375 19.1592 0 18.7141 0 18.25V1.75C0 0.784 0.784 0 1.75 0ZM1.5 1.75V18.25C1.5 18.388 1.612 18.5 1.75 18.5H13V1.5H1.75C1.6837 1.5 1.62011 1.52634 1.57322 1.57322C1.52634 1.62011 1.5 1.6837 1.5 1.75ZM14.5 18.5H18.25C18.3163 18.5 18.3799 18.4737 18.4268 18.4268C18.4737 18.3799 18.5 18.3163 18.5 18.25V1.75C18.5 1.6837 18.4737 1.62011 18.4268 1.57322C18.3799 1.52634 18.3163 1.5 18.25 1.5H14.5V18.5Z" fill={color}/>
  </svg>
);

// Footer Icons
export const BuildingIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "#144D5A" }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5 15.8333H19.1667V17.5H0.833333V15.8333H2.5V3.33333C2.5 3.11232 2.5878 2.90036 2.74408 2.74408C2.90036 2.5878 3.11232 2.5 3.33333 2.5H11.6667C11.8877 2.5 12.0996 2.5878 12.2559 2.74408C12.4122 2.90036 12.5 3.11232 12.5 3.33333V15.8333H15.8333V9.16667H14.1667V7.5H16.6667C16.8877 7.5 17.0996 7.5878 17.2559 7.74408C17.4122 7.90036 17.5 8.11232 17.5 8.33333V15.8333ZM4.16667 4.16667V15.8333H10.8333V4.16667H4.16667ZM5.83333 9.16667H9.16667V10.8333H5.83333V9.16667ZM5.83333 5.83333H9.16667V7.5H5.83333V5.83333Z" fill={color}/>
  </svg>
);

export const PersonIcon: React.FC<IconProps> = ({ width = 14, height = 19, className, color = "#144D5A" }) => (
  <svg width={width} height={height} viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M0.333328 18.3334C0.333328 16.5653 1.03571 14.8696 2.28595 13.6193C3.53619 12.3691 5.23188 11.6667 6.99999 11.6667C8.7681 11.6667 10.4638 12.3691 11.714 13.6193C12.9643 14.8696 13.6667 16.5653 13.6667 18.3334H12C12 17.0073 11.4732 15.7355 10.5355 14.7978C9.59785 13.8602 8.32608 13.3334 6.99999 13.3334C5.67391 13.3334 4.40214 13.8602 3.46446 14.7978C2.52678 15.7355 1.99999 17.0073 1.99999 18.3334H0.333328ZM6.99999 10.8334C4.23749 10.8334 1.99999 8.59587 1.99999 5.83337C1.99999 3.07087 4.23749 0.833374 6.99999 0.833374C9.7625 0.833374 12 3.07087 12 5.83337C12 8.59587 9.7625 10.8334 6.99999 10.8334ZM6.99999 9.16671C8.84166 9.16671 10.3333 7.67504 10.3333 5.83337C10.3333 3.99171 8.84166 2.50004 6.99999 2.50004C5.15833 2.50004 3.66666 3.99171 3.66666 5.83337C3.66666 7.67504 5.15833 9.16671 6.99999 9.16671Z" fill={color}/>
  </svg>
);

// Filter/Table Icons
export const StarIcon: React.FC<IconProps> = ({ width = 16, height = 16, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color}/>
  </svg>
);

// Editor Icons
export const BulletListIcon: React.FC<IconProps> = ({ width = 16, height = 16, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="6" cy="12" r="2" fill={color}/>
    <path d="M10 12h10M10 6h10M10 18h10" stroke={color} strokeWidth="2"/>
  </svg>
);

export const NumberedListIcon: React.FC<IconProps> = ({ width = 16, height = 16, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 6h11M10 12h11M10 18h11M4 6v4M4 10l2-2M6 18H2l4-4v2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const FileIcon: React.FC<IconProps> = ({ width = 16, height = 16, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke={color} strokeWidth="2"/>
    <polyline points="13,2 13,9 20,9" stroke={color} strokeWidth="2"/>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ width = 16, height = 16, className, color = "currentColor" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2"/>
  </svg>
);
// Add these to your existing icons
export const CollapseIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.75 0H18.25C19.216 0 20 0.784 20 1.75V18.25C20 18.7141 19.8156 19.1592 19.4874 19.4874C19.1592 19.8156 18.7141 20 18.25 20H1.75C1.28587 20 0.840752 19.8156 0.512563 19.4874C0.184375 19.1592 0 18.7141 0 18.25V1.75C0 0.784 0.784 0 1.75 0ZM1.5 1.75V18.25C1.5 18.388 1.612 18.5 1.75 18.5H13V1.5H1.75C1.6837 1.5 1.62011 1.52634 1.57322 1.57322C1.52634 1.62011 1.5 1.6837 1.5 1.75ZM14.5 18.5H18.25C18.3163 18.5 18.3799 18.4737 18.4268 18.4268C18.4737 18.3799 18.5 18.3163 18.5 18.25V1.75C18.5 1.6837 18.4737 1.62011 18.4268 1.57322C18.3799 1.52634 18.3163 1.5 18.25 1.5H14.5V18.5Z" fill={color}/>
  </svg>
);

export const ExpandIcon: React.FC<IconProps> = ({ width = 20, height = 20, className, color = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18.25 0H1.75C0.784 0 0 0.784 0 1.75V18.25C0 18.7141 0.184375 19.1592 0.512563 19.4874C0.840752 19.8156 1.28587 20 1.75 20H18.25C18.7141 20 19.1592 19.8156 19.4874 19.4874C19.8156 19.1592 20 18.7141 20 18.25V1.75C20 0.784 19.216 0 18.25 0ZM18.5 1.75V18.25C18.5 18.388 18.388 18.5 18.25 18.5H7V1.5H18.25C18.3163 1.5 18.3799 1.52634 18.4268 1.57322C18.4737 1.62011 18.5 1.6837 18.5 1.75ZM5.5 18.5H1.75C1.6837 18.5 1.62011 18.4737 1.57322 18.4268C1.52634 18.3799 1.5 18.3163 1.5 18.25V1.75C1.5 1.6837 1.52634 1.62011 1.57322 1.57322C1.62011 1.52634 1.6837 1.5 1.75 1.5H5.5V18.5Z" fill={color}/>
  </svg>
);
// Add this to your existing icons
export const SelectDropdownIcon: React.FC<IconProps> = ({ width = 8, height = 12, className, color = "#868E96" }) => (
  <svg width={width} height={height} viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.66663 4.24999L3.99996 1.91666L6.33329 4.24999M6.33329 7.74999L3.99996 10.0833L1.66663 7.74999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);