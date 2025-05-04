import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import authService from "../services/auth.service";
import axios from "axios";

// Create a separate file for this service in your actual implementation
const API_URL = "http://localhost:8080/api/";

// Define the favorite service
const favoriteService = {
  getFavorites() {
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = user && user.accessToken ? { 'x-access-token': user.accessToken } : {};
    return axios.get(API_URL + "favorites", { headers });
  },
  toggleFavorite(countryCode, countryName, flagUrl) {
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = user && user.accessToken ? { 'x-access-token': user.accessToken } : {};
    return axios.put(
      API_URL + "favorites/toggle",
      { countryCode, countryName, flagUrl },
      { headers }
    );
  }
};

const Profile = () => {
  const currentUser = authService.getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("I'm a country enthusiast exploring the world through this amazing application.");
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Start with false to prevent immediate loading
  const [error, setError] = useState(null);
  const [didInitialFetch, setDidInitialFetch] = useState(false);
  
  // Separate effect for initial data loading to prevent infinite loops
  useEffect(() => {
    if (!didInitialFetch) {
      fetchFavoriteCountries();
      setDidInitialFetch(true);
    }
  }, [didInitialFetch]);

  // Prevent rendering if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Function to fetch favorite countries
  const fetchFavoriteCountries = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get favorites from the backend API
      const response = await favoriteService.getFavorites();
      
      // Check if the response has the expected structure
      if (response.data && Array.isArray(response.data.favoriteCountries)) {
        setFavoriteCountries(response.data.favoriteCountries);
      } else {
        // Fallback to localStorage if API response is not as expected
        loadFromLocalStorage();
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      // On API error, try to load from localStorage
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to load favorites from localStorage
  const loadFromLocalStorage = () => {
    try {
      const localFavorites = localStorage.getItem("favoriteCountries");
      if (localFavorites) {
        const savedFavorites = JSON.parse(localFavorites);
        setFavoriteCountries(savedFavorites);
      } else {
        setFavoriteCountries([]);
      }
    } catch (localErr) {
      console.error("Error reading from localStorage:", localErr);
      setError("Failed to load favorite countries. Please try refreshing the page.");
      setFavoriteCountries([]);
    }
  };

  // Function to remove a favorite country
  const removeFavorite = async (countryCode) => {
    if (!currentUser) return;
    
    try {
      const response = await favoriteService.toggleFavorite(
        countryCode,
        "", // Name not needed for removal
        ""  // Flag URL not needed for removal
      );
      
      if (response.data && Array.isArray(response.data.favoriteCountries)) {
        setFavoriteCountries(response.data.favoriteCountries);
      } else {
        // Fallback to local removal if API response is unexpected
        const updatedFavorites = favoriteCountries.filter(country => 
          country.code !== countryCode && country.cca3 !== countryCode
        );
        setFavoriteCountries(updatedFavorites);
        localStorage.setItem("favoriteCountries", JSON.stringify(updatedFavorites));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      
      // Client-side removal on API failure
      const updatedFavorites = favoriteCountries.filter(country => 
        country.code !== countryCode && country.cca3 !== countryCode
      );
      setFavoriteCountries(updatedFavorites);
      localStorage.setItem("favoriteCountries", JSON.stringify(updatedFavorites));
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const formatRoleName = (role) => {
    return role.replace('ROLE_', '').charAt(0).toUpperCase() + role.replace('ROLE_', '').slice(1).toLowerCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Cover Image Section */}
        <div className="relative h-60 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl overflow-hidden">
          <div className="absolute bottom-4 right-4">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white shadow-lg rounded-b-xl relative pb-8">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-white p-1 shadow-xl">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(currentUser.username)}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
                <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Info Header */}
          <div className="pt-20 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentUser.username}</h1>
                <p className="text-gray-600">{currentUser.email}</p>
                <div className="flex mt-2 space-x-2">
                  {currentUser.roles && currentUser.roles.map((role, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {formatRoleName(role)}
                    </span>
                  ))}
                </div>
              </div>              
            </div>

            {/* Favorite Countries */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Favorite Countries</h3>
                <button
                  onClick={fetchFavoriteCountries}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Refresh
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading your favorite countries...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={fetchFavoriteCountries}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : favoriteCountries.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">You haven't added any favorite countries yet.</p>
                  <Link to="/" className="inline-block mt-4 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    Explore Countries
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {favoriteCountries.map((country) => (
                    <div key={country.code || country.cca3 || Math.random()} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                      <div className="flex flex-col items-center text-center">
                        <Link to={`/country/${country.code || country.cca3}`} className="block">
                          <img 
                            src={country.flag || country.flagUrl} 
                            alt={`Flag of ${country.name}`} 
                            className="h-16 w-24 object-cover border border-gray-200 rounded mb-2" 
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Flag+Not+Found';
                            }}
                          />
                          <h4 className="font-medium text-gray-900">{country.name}</h4>
                        </Link>
                        <button 
                          onClick={() => removeFavorite(country.code || country.cca3)}
                          className="mt-2 text-rose-500 hover:text-rose-600 transition-colors duration-200"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
