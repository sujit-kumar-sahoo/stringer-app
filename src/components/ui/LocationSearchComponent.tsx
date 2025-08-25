// Enhanced Location Search Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface Location {
  id: string;
  name: string;
}

interface LocationSearchProps {
  selectedLocation: Location | null;
  onLocationChange: (location: Location | null) => void;
  availableLocations?: Location[]; 
  placeholder?: string;
  isLoading?: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  selectedLocation,
  onLocationChange,
  availableLocations = [],
  placeholder = "Search or add location...",
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use only provided locations (no defaults)
  const allLocations = useMemo(() => availableLocations, [availableLocations]);

  // Filter locations effect with optimized dependencies
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allLocations.filter(location => {
        // Safety check for location name
        const locationName = location?.name;
        if (!locationName || typeof locationName !== 'string') {
          return false;
        }
        
        return locationName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!selectedLocation || location.id !== selectedLocation.id);
      });
      setFilteredLocations(filtered);
      setIsDropdownOpen(true);
    } else {
      setFilteredLocations([]);
      setIsDropdownOpen(false);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, allLocations, selectedLocation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoize callback functions to prevent unnecessary re-renders
  const selectLocation = useCallback((location: Location) => {
    onLocationChange(location);
    setSearchTerm('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  }, [onLocationChange]);

  const clearLocation = useCallback(() => {
    onLocationChange(null);
    setSearchTerm('');
    inputRef.current?.focus();
  }, [onLocationChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredLocations.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredLocations.length) {
        selectLocation(filteredLocations[highlightedIndex]);
      } else if (searchTerm.trim() && filteredLocations.length === 0) {
        // Create new location
        const newLocation: Location = {
          id: Date.now().toString(),
          name: searchTerm.trim()
        };
        selectLocation(newLocation);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Backspace' && !searchTerm && selectedLocation) {
      // Clear location when backspacing on empty input
      clearLocation();
    }
  }, [highlightedIndex, filteredLocations, searchTerm, selectLocation, selectedLocation, clearLocation]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (searchTerm.trim()) {
      setIsDropdownOpen(true);
    }
  }, [searchTerm]);

  // Display value - show selected location or search term
  const displayValue = selectedLocation && !searchTerm ? selectedLocation.name : searchTerm;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location<sup className="text-red-500">*</sup>
      </label>
      
      {/* Selected Location Display */}
      {selectedLocation && !searchTerm && (
        <div className="flex items-center mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {selectedLocation?.name || 'Unknown Location'}
            <button
              type="button"
              onClick={clearLocation}
              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600 focus:outline-none"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={isLoading ? "Loading locations..." : placeholder}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:text-gray-500"
        />
        
        {/* Location Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredLocations.length > 0 ? (
            <>
              {filteredLocations.map((location, index) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => selectLocation(location)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors flex items-center ${
                    index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {location.name}
                </button>
              ))}
            </>
          ) : searchTerm.trim() ? (
            <button
              type="button"
              onClick={() => {
                const newLocation: Location = {
                  id: Date.now().toString(),
                  name: searchTerm.trim()
                };
                selectLocation(newLocation);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-blue-600">Create new location:</span> "{searchTerm.trim()}"
            </button>
          ) : null}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-1">
        {isLoading 
          ? "Loading location options..." 
          : "Type to create a new location or search available locations."
        }
        {selectedLocation && ` Selected: ${selectedLocation.name || 'Unknown'}`}
      </p>
    </div>
  );
};

export default LocationSearch;