import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, MapPin, Globe, User, ChevronDown, Heart, X } from "lucide-react";
import favoriteService from "../services/favorite.service";
import authService from "../services/auth.service";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState({});
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Fetch all countries on component mount
    fetchAllCountries();
    
    // Load favorites
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    if (currentUser) {
      try {
        const response = await favoriteService.getFavorites();
        setFavorites(response.data.favoriteCountries || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        // Fallback to localStorage
        const savedFavorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
        setFavorites(savedFavorites);
      }
    } else {
      // Not logged in, use localStorage
      const savedFavorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
      setFavorites(savedFavorites);
    }
  };

  const fetchAllCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchCountries = async () => {
    if (!searchTerm) {
      fetchAllCountries();
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${searchTerm}`);
      setCountries(response.data);
      setIsFilterActive(true);
    } catch (error) {
      console.error("Error searching countries:", error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByRegion = async (regionValue) => {
    setRegion(regionValue);
    setShowRegionDropdown(false);
    
    if (!regionValue) {
      fetchAllCountries();
      setIsFilterActive(false);
      return;
    }
    
    setLoading(true);
    setIsFilterActive(true);
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/region/${regionValue}`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error filtering countries by region:", error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchCountries();
  };

  // New toggleFavorite function that interacts with the backend
  const toggleFavorite = async (e, country) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent any other events
    
    // Set loading state for this country
    setIsFavoriteLoading(prev => ({...prev, [country.cca3]: true}));
    
    if (currentUser) {
      // User is logged in, use API
      try {
        const response = await favoriteService.toggleFavorite(
          country.cca3,
          country.name.common,
          country.flags.png
        );
        
        setFavorites(response.data.favoriteCountries);
      } catch (err) {
        console.error("Error toggling favorite:", err);
        
        // Fallback to localStorage
        toggleLocalFavorite(country);
      } finally {
        setIsFavoriteLoading(prev => ({...prev, [country.cca3]: false}));
      }
    } else {
      // User is not logged in, use localStorage
      toggleLocalFavorite(country);
      setIsFavoriteLoading(prev => ({...prev, [country.cca3]: false}));
    }
  };

  // Helper function for localStorage fallback
  const toggleLocalFavorite = (country) => {
    const isFavorite = favorites.some(fav => fav.code === country.cca3);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.code !== country.cca3);
    } else {
      newFavorites = [...favorites, {
        code: country.cca3,
        name: country.name.common,
        flag: country.flags.png
      }];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem("favoriteCountries", JSON.stringify(newFavorites));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRegion("");
    setIsFilterActive(false);
    fetchAllCountries();
  };

  // Sort countries based on the selected sort option
  const sortedCountries = [...countries].sort((a, b) => {
    switch(sortBy) {
      case "name":
        return a.name.common.localeCompare(b.name.common);
      case "population-high":
        return b.population - a.population;
      case "population-low":
        return a.population - b.population;
      default:
        return 0;
    }
  });

  // Create skeleton loading cards
  const renderSkeletons = () => {
    return Array(8).fill().map((_, index) => (
      <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
        <div className="h-40 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-5 bg-gray-300 rounded-md mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded-md mb-2 w-full"></div>
          <div className="h-4 bg-gray-300 rounded-md mb-2 w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded-md w-4/6"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">Explore the World</h1>
          <p className="text-gray-600 text-center mb-10">Discover information about countries around the globe</p>
          
          <div className="mb-10 flex flex-col md:flex-row gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 left-0 px-3 flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            
            {/* Filters Container */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Region Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between shadow-sm hover:border-indigo-500 transition-all duration-200"
                >
                  <span className="text-gray-700">{region ? `Region: ${region.charAt(0).toUpperCase() + region.slice(1)}` : "Filter by Region"}</span>
                  <ChevronDown size={18} className={`ml-2 transition-transform duration-200 ${showRegionDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showRegionDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="py-1">
                      <button 
                        onClick={() => filterByRegion("")}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        All Regions
                      </button>
                      {["Africa", "Americas", "Asia", "Europe", "Oceania"].map(regionName => (
                        <button
                          key={regionName}
                          onClick={() => filterByRegion(regionName.toLowerCase())}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          {regionName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="population-high">Population (High to Low)</option>
                <option value="population-low">Population (Low to High)</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {isFilterActive && (
            <div className="mb-6 flex items-center flex-wrap">
              <span className="text-gray-600 mr-2">Active filters:</span>
              {searchTerm && (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
                  Search: {searchTerm}
                </span>
              )}
              {region && (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center mr-2 mb-2">
                  Region: {region.charAt(0).toUpperCase() + region.slice(1)}
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="text-gray-500 hover:text-red-600 flex items-center text-sm ml-2 mb-2"
              >
                <X size={16} className="mr-1" /> Clear all
              </button>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {countries.length} {countries.length === 1 ? 'country' : 'countries'}
            </p>
          </div>
          
          {/* Countries Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {renderSkeletons()}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedCountries.length > 0 ? (
                sortedCountries.map((country) => {
                  const isFavorite = favorites.some(fav => 
                    (fav.code === country.cca3) || (fav.cca3 === country.cca3)
                  );
                  
                  return (
                    <Link 
                      key={country.cca3} 
                      to={`/country/${country.cca3}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={country.flags.png}
                          alt={`Flag of ${country.name.common}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <button 
                          className={`absolute top-3 right-3 p-2 rounded-full ${
                            isFavoriteLoading[country.cca3] ? "bg-gray-300" :
                            isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-500 hover:text-red-500'
                          } transition-colors duration-200`}
                          onClick={(e) => toggleFavorite(e, country)}
                          disabled={isFavoriteLoading[country.cca3]}
                          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          {isFavoriteLoading[country.cca3] ? (
                            <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Heart size={18} fill={isFavorite ? "#EF4444" : "none"} />
                          )}
                        </button>
                      </div>
                      <div className="p-5">
                        <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">{country.name.common}</h2>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center">
                            <User size={16} className="mr-2 text-indigo-500" />
                            <span className="font-medium">Population:</span>
                            <span className="ml-1">{country.population.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Globe size={16} className="mr-2 text-indigo-500" />
                            <span className="font-medium">Region:</span>
                            <span className="ml-1">{country.region}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2 text-indigo-500" />
                            <span className="font-medium">Capital:</span>
                            <span className="ml-1">{country.capital?.[0] || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="mt-4 text-right">
                          <span className="text-indigo-600 text-sm font-medium group-hover:underline">View details</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl text-gray-600 mb-2">No countries found</p>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>      
    </div>
  );
};

export default Home;
