import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigateTo = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300"
         style={{
           backgroundColor: 'var(--bg-card)',
           borderColor: 'var(--border-primary)',
           boxShadow: 'var(--shadow-sm)'
         }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate(`/`)}
            className="flex items-center space-x-2 font-bold text-xl transition-colors duration-200 hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'var(--gradient-primary)' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="hidden sm:inline gradient-text font-bold">
              Github ID Card Maker
            </span>
            <span className="sm:hidden gradient-text font-bold">GICM</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigateTo("/")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-indigo-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("/about")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-indigo-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              About
            </button>
            <button
              onClick={() => navigateTo("/contact")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-indigo-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              Contact
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200 hover:text-indigo-500"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            <button
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {dropdownOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 z-50 animate-fade-in"
               style={{ 
                 backgroundColor: 'var(--bg-card)',
                 borderColor: 'var(--border-primary)',
                 boxShadow: 'var(--shadow-lg)'
               }}>
            <div className="px-4 py-2 space-y-1 border-t"
                 style={{ borderColor: 'var(--border-primary)' }}>
              <button
                onClick={() => navigateTo("/")}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-indigo-500"
                style={{ color: 'var(--text-secondary)' }}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo("/about")}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-indigo-500"
                style={{ color: 'var(--text-secondary)' }}
              >
                About
              </button>
              <button
                onClick={() => navigateTo("/contact")}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-indigo-500"
                style={{ color: 'var(--text-secondary)' }}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
