import React, { createContext, useContext, useEffect, useState } from 'react';
import { CardTheme, getTheme } from '../themes/card_theme';

// Website theme types
export type WebsiteTheme = 'light' | 'dark';

interface ThemeContextType {
  // Website theme (light/dark)
  websiteTheme: WebsiteTheme;
  setWebsiteTheme: (theme: WebsiteTheme) => void;
  toggleWebsiteTheme: () => void;
  
  // Card theme
  cardTheme: string;
  setCardTheme: (theme: string) => void;
  getCardThemeData: () => CardTheme;
  
  // Legacy support for existing components
  theme: WebsiteTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [websiteTheme, setWebsiteTheme] = useState<WebsiteTheme>(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('website-theme') as WebsiteTheme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [cardTheme, setCardTheme] = useState<string>(() => {
    const savedCardTheme = localStorage.getItem('card-theme');
    return savedCardTheme || 'default';
  });

  useEffect(() => {
    localStorage.setItem('website-theme', websiteTheme);
    
    // Apply theme to document
    if (websiteTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [websiteTheme]);

  useEffect(() => {
    localStorage.setItem('card-theme', cardTheme);
  }, [cardTheme]);

  const toggleWebsiteTheme = () => {
    setWebsiteTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const getCardThemeData = (): CardTheme => {
    return getTheme(cardTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      websiteTheme,
      setWebsiteTheme,
      toggleWebsiteTheme,
      cardTheme,
      setCardTheme,
      getCardThemeData,
      // Legacy support
      theme: websiteTheme,
      toggleTheme: toggleWebsiteTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};