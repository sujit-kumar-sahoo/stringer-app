import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addLocations, getLocations } from "@/services/locationService";

interface Location {
  id: string;
  name: string;
}

interface ApiLocation {
  id: number;
  location: string;
}

const LocationForm: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');


  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await getLocations();
      if (response.success && response.data) {
        const convertedLocations: Location[] = response.data.map((apiLocation: ApiLocation) => ({
          id: apiLocation.id.toString(),
          name: apiLocation.location.trim()
        }));
        // Sort by ID descending to show newest first (assuming higher ID = newer)
        const sortedLocations = convertedLocations.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setLocations(sortedLocations);
      }
    } catch (err: any) {
      // Error handling without UI display - could log to console if needed
      console.log('Failed to load locations');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!currentLocation.trim()) {
      return; // Just return without showing error
    }

    // Check if location already exists
    const locationExists = locations.some(location =>
      location.name.toLowerCase() === currentLocation.trim().toLowerCase()
    );

    if (locationExists) {
      setError('This location already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const locationName = currentLocation.trim();
      const response = await addLocations({ location: locationName });

      // Debug: Log the response to understand its structure
      console.log('API Response:', response);

      let newLocation: Location | null = null;

      // Handle different response formats with proper null checks
      if (response.success && response.data) {
        // Standard success response
        const apiLocation = response.data;
        console.log('API Location data:', apiLocation);

        if (apiLocation && apiLocation.id && apiLocation.location) {
          newLocation = {
            id: apiLocation.id.toString(),
            name: apiLocation.location.trim()
          };
        }
      } else if ((response as any).id && (response as any).location) {
        // Direct response format
        console.log('Direct response format:', response);
        newLocation = {
          id: (response as any).id.toString(),
          name: (response as any).location.trim()
        };
      } else {
        // Try to handle other possible formats
        console.log('Checking alternative response formats...');

        // Maybe the API returns the location data directly
        if ((response as any).id && ((response as any).name || (response as any).location_name)) {
          newLocation = {
            id: (response as any).id.toString(),
            name: ((response as any).name || (response as any).location_name).trim()
          };
        }
        // Or maybe it's nested differently
        else if ((response as any).location && (response as any).location.id && (response as any).location.location) {
          newLocation = {
            id: (response as any).location.id.toString(),
            name: (response as any).location.location.trim()
          };
        }
        // If all else fails, create a temporary location and refresh
        else if ((response as any).id || (response as any).success) {
          console.log('Creating temporary location, will refresh to get actual data');
          // If we know it was successful but can't parse the response,
          // clear the form and refresh the locations
          setCurrentLocation('');
          setSuccessMessage('Location added successfully! Refreshing list...');
          setTimeout(() => {
            loadLocations();
            setSuccessMessage('');
          }, 1000);
          return;
        }
      }

      setCurrentLocation('');


      setSuccessMessage(`Location "${locationName}" added successfully!`);

      await loadLocations();


      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.log('Error adding location:', err);

    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLocation(e.target.value);
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleRefresh = () => {
    loadLocations();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - All Locations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              All Locations ({locations.length})
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isLoadingLocations}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              title="Refresh locations"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingLocations ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoadingLocations ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Loading locations...</p>
              </div>
            ) : locations.length > 0 ? (
              locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium truncate">{location.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No locations found</p>
                <p className="text-sm mt-1">Add your first location to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add Location Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            Add New Location
          </h3>

          <div className="space-y-4">
            {/* Error Message - Only for duplicate locations */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="locationName"
                value={currentLocation}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter location name (e.g., New York, London, Tokyo)"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddLocation(e)}
              />
            </div>

            <button
              onClick={handleAddLocation}
              disabled={isLoading || !currentLocation.trim()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading || !currentLocation.trim()
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Location...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Location
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;