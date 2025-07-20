// Navbar Component (src/components/Navbar.jsx)
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Modern Natarix Navbar Component
 * Features:
 * - Glassmorphism design with blur effects
 * - Modern hover animations
 * - Responsive mobile menu
 * - Active link highlighting
 * - Clean typography and spacing
 */
const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local state for mobile menu and user dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Handle logout with navigation
   */
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  /**
   * Check if a link is active
   */
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  /**
   * Close mobile menu when clicking outside
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Show loading spinner while auth state is loading
  if (isLoading) {
    return (
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '30px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #dc2626, #b91c1c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none'
            }}>
              Natarix
            </div>
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          
          {/* Left Side - Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{
              fontSize: '30px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #dc2626, #b91c1c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none'
            }}>
              Natarix
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div style={{ flex: 1, maxWidth: '250px', margin: '0 16px' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Natarix..."
                style={{
                  width: '250px',
                  padding: '8px 12px 8px 28px',
                  border: '1px solid #d1d5db',
                  borderRadius: '9999px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '8px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg style={{ width: '12px', height: '12px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          {/* Right Side - Navigation & User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Desktop Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link 
                to="/" 
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: isActiveLink('/') ? '#dc2626' : '#374151',
                  backgroundColor: isActiveLink('/') ? '#fef2f2' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                Home
              </Link>
              <Link 
                to="/popular" 
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: isActiveLink('/popular') ? '#dc2626' : '#374151',
                  backgroundColor: isActiveLink('/popular') ? '#fef2f2' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                Popular
              </Link>
              <Link 
                to="/all" 
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: isActiveLink('/all') ? '#dc2626' : '#374151',
                  backgroundColor: isActiveLink('/all') ? '#fef2f2' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                All
              </Link>
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <>
                {/* Create Post Button */}
                <Link
                  to="/submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s'
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Post</span>
                </Link>

                {/* User Menu */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#374151',
                      transition: 'all 0.3s',
                      border: 'none',
                      background: 'transparent',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(to right, #ef4444, #dc2626)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span style={{ fontWeight: '500' }}>{user?.username || 'User'}</span>
                    <svg 
                      style={{ 
                        width: '16px', 
                        height: '16px',
                        transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '12px',
                      width: '224px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      padding: '8px',
                      zIndex: 50,
                      border: '1px solid rgba(229, 231, 235, 0.5)'
                    }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                          {user?.username || 'User'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      
                      <Link
                        to="/user/profile"
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 16px',
                          fontSize: '14px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        Profile
                      </Link>
                      
                      <Link
                        to="/user/saved"
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 16px',
                          fontSize: '14px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        Saved Posts
                      </Link>
                      
                      <Link
                        to="/user/settings"
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 16px',
                          fontSize: '14px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 16px',
                          fontSize: '14px',
                          color: '#374151',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '14px',
                    textDecoration: 'none',
                    color: isActiveLink('/login') ? '#dc2626' : '#374151',
                    backgroundColor: isActiveLink('/login') ? '#fef2f2' : 'transparent',
                    transition: 'all 0.3s'
                  }}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  style={{
                    background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s'
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <div style={{ display: 'block' }}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  color: '#374151',
                  transition: 'all 0.3s',
                  border: 'none',
                  background: 'transparent',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                aria-label="Toggle mobile menu"
              >
                <svg 
                  style={{ width: '24px', height: '24px' }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div style={{
            borderTop: '1px solid rgba(229, 231, 235, 0.5)',
            padding: '16px 0',
            marginTop: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                to="/"
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActiveLink('/') ? '#dc2626' : '#374151',
                  backgroundColor: isActiveLink('/') ? '#fef2f2' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                Home
              </Link>
              
              <Link
                to="/popular"
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActiveLink('/popular') ? '#dc2626' : '#374151',
                  backgroundColor: isActiveLink('/popular') ? '#fef2f2' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                Popular
              </Link>
              
              <Link
                to="/all"
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActiveLink('/all') ? '#dc2626' : '#374151',
                  backgroundColor: isActiveLink('/all') ? '#fef2f2' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                All
              </Link>

              {isAuthenticated && (
                <>
                  <div style={{ borderTop: '1px solid rgba(229, 231, 235, 0.5)', paddingTop: '16px', marginTop: '16px' }}>
                    <Link
                      to="/submit"
                      onClick={closeMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                        color: 'white',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s'
                      }}
                    >
                      Create Post
                    </Link>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(229, 231, 235, 0.5)', paddingTop: '16px', marginTop: '16px' }}>
                    <Link
                      to="/user/profile"
                      onClick={closeMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.3s'
                      }}
                    >
                      Profile
                    </Link>
                    
                    <Link
                      to="/user/saved"
                      onClick={closeMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.3s'
                      }}
                    >
                      Saved Posts
                    </Link>
                    
                    <Link
                      to="/user/settings"
                      onClick={closeMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.3s'
                      }}
                    >
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#374151',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;