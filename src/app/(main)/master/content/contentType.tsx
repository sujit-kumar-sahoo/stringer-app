import React, { useState, useEffect } from 'react';
import { Plus, FileText, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addContentTypes, getContentTypes } from "@/services/contentTypeService";

interface ContentType {
  id: string;
  name: string;
}

interface ApiContentType {
  id: number;
  content_type: string;
}

const ContentTypeForm: React.FC = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [currentContentType, setCurrentContentType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingContentTypes, setIsLoadingContentTypes] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadContentTypes();
  }, []);

  const loadContentTypes = async () => {
    setIsLoadingContentTypes(true);
    try {
      const response = await getContentTypes();
      if (response.success && response.data) {
        const convertedContentTypes: ContentType[] = response.data.map((apiContentType: ApiContentType) => ({
          id: apiContentType.id.toString(),
          name: apiContentType.content_type.trim()
        }));
        // Sort by ID descending to show newest first (assuming higher ID = newer)
        const sortedContentTypes = convertedContentTypes.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setContentTypes(sortedContentTypes);
      }
    } catch (err: any) {
      // Error handling without UI display - could log to console if needed
      console.log('Failed to load content types');
    } finally {
      setIsLoadingContentTypes(false);
    }
  };

  const handleAddContentType = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!currentContentType.trim()) {
      return; // Just return without showing error
    }

    // Check if content type already exists
    const contentTypeExists = contentTypes.some(contentType => 
      contentType.name.toLowerCase() === currentContentType.trim().toLowerCase()
    );

    if (contentTypeExists) {
      setError('This content type already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const contentTypeName = currentContentType.trim();
      const response = await addContentTypes({ content_type: contentTypeName });
      
      // Debug: Log the response to understand its structure
      console.log('API Response:', response);
      
      let newContentType: ContentType | null = null;
      
      // Handle different response formats with proper null checks
      if (response.success && response.data) {
        // Standard success response
        const apiContentType = response.data;
        console.log('API Content Type data:', apiContentType);
        
        if (apiContentType && apiContentType.id && apiContentType.content_type) {
          newContentType = {
            id: apiContentType.id.toString(),
            name: apiContentType.content_type.trim()
          };
        }
      } else if ((response as any).id && (response as any).content_type) {
        // Direct response format
        console.log('Direct response format:', response);
        newContentType = {
          id: (response as any).id.toString(),
          name: (response as any).content_type.trim()
        };
      } else {
        // Try to handle other possible formats
        console.log('Checking alternative response formats...');
        
        // Maybe the API returns the content type data directly
        if ((response as any).id && ((response as any).name || (response as any).content_type_name)) {
          newContentType = {
            id: (response as any).id.toString(),
            name: ((response as any).name || (response as any).content_type_name).trim()
          };
        }
        // Or maybe it's nested differently
        else if ((response as any).contentType && (response as any).contentType.id && (response as any).contentType.content_type) {
          newContentType = {
            id: (response as any).contentType.id.toString(),
            name: (response as any).contentType.content_type.trim()
          };
        }
        // If all else fails, create a temporary content type and refresh
        else if ((response as any).id || (response as any).success) {
          console.log('Creating temporary content type, will refresh to get actual data');
          // If we know it was successful but can't parse the response,
          // clear the form and refresh the content types
          setCurrentContentType('');
          setSuccessMessage('Content type added successfully! Refreshing list...');
          setTimeout(() => {
            loadContentTypes();
            setSuccessMessage('');
          }, 1000);
          return;
        }
      }
      
      if (newContentType) {
        // Add to local state immediately at the beginning of the array
        setContentTypes(prev => [newContentType!, ...prev]);
        setCurrentContentType('');
        setSuccessMessage(`Content type "${newContentType.name}" added successfully!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.log('Could not parse content type from response, refreshing list');
        // Clear the input field even if we couldn't parse the response
        setCurrentContentType('');
        // Auto-refresh after a short delay
        setTimeout(() => {
          loadContentTypes();
        }, 2000);
      }
      
    } catch (err: any) {
      console.log('Error adding content type:', err);
      // Just continue without showing error to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentContentType(e.target.value);
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleRefresh = () => {
    loadContentTypes();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - All Content Types */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              All Content Types ({contentTypes.length})
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isLoadingContentTypes}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              title="Refresh content types"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingContentTypes ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoadingContentTypes ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Loading content types...</p>
              </div>
            ) : contentTypes.length > 0 ? (
              contentTypes.map((contentType) => (
                <div key={contentType.id} className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-md border border-purple-200 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium truncate">{contentType.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">#{contentType.id}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No content types found</p>
                <p className="text-sm mt-1">Add your first content type to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add Content Type Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            Add New Content Type
          </h3>
          
          <div className="space-y-4">
            {/* Error Message - Only for duplicate content types */}
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
              <label htmlFor="contentTypeName" className="block text-sm font-medium text-gray-700 mb-1">
                Content Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contentTypeName"
                value={currentContentType}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter content type name (e.g., AVO, PKG, LIVE, DIGI)"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddContentType(e)}
              />
            </div>
            
            <button
              onClick={handleAddContentType}
              disabled={isLoading || !currentContentType.trim()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                isLoading || !currentContentType.trim()
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Content Type...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Content Type
                </>
              )}
            </button>

            {/* Quick Preview Section */}
            {contentTypes.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick view:</p>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.slice(0, 6).map((contentType) => (
                    <span
                      key={contentType.id}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                    >
                      <FileText className="h-3 w-3" />
                      {contentType.name}
                    </span>
                  ))}
                  {contentTypes.length > 6 && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                      +{contentTypes.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTypeForm;