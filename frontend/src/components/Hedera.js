import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Hedera = ({ currentUser, logOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Enhanced logout function
  const handleLogOut = (e) => {
    e.preventDefault();
    logOut();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-2 text-white text-xl font-bold">Countries App</span>
              </Link>
            </div>
            
            {/* Desktop navigation links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`${
                    location.pathname === "/"
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  } px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right side menu (desktop) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <div className="relative">
                  <div>
                    <button
                      ref={buttonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserDropdownOpen(!isUserDropdownOpen);
                      }}
                      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                    >
                      <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center text-white font-semibold mr-2">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white mr-1">{currentUser.username}</span>
                      <svg className={`h-4 w-4 text-white transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isUserDropdownOpen && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>                      
                      <button
                        onClick={handleLogOut}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/login"
                    className={`${
                      location.pathname === "/login"
                        ? "bg-white text-indigo-600"
                        : "text-white border border-white/30 hover:bg-white hover:text-indigo-600"
                    } px-4 py-2 rounded-md text-sm font-medium transition-all duration-200`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`${
                      location.pathname === "/register"
                        ? "bg-white text-indigo-600"
                        : "bg-indigo-700 text-white hover:bg-indigo-800"
                    } px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2 rounded-md"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-white/10`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`${
              location.pathname === "/"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            } block px-3 py-2 rounded-md text-base font-medium`}
          >
            Home
          </Link>          
        </div>
        
        {/* Mobile menu auth section */}
        <div className="pt-4 pb-3 border-t border-white/10">
          {currentUser ? (
            <div>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center text-white font-semibold">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{currentUser.username}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Your Profile
                </Link>                
                <button
                  onClick={handleLogOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/login"
                className="w-full block text-center px-4 py-2 rounded-md text-base font-medium bg-white/10 text-white hover:bg-white/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full block text-center px-4 py-2 rounded-md text-base font-medium bg-white text-indigo-600 hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Hedera;
