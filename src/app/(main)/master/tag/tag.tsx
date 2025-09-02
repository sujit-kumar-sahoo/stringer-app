import React, { useState, useEffect } from 'react';
import { Plus, Tag, X, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addTags, getTags } from "@/services/tagService";

interface Tag {
  id: string;
  name: string;
}

interface ApiTag {
  id: number;
  name: string;
}

const TagForm: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setIsLoadingTags(true);
    try {
      const response = await getTags();
      if (response.success && response.data) {
        const convertedTags: Tag[] = response.data.map((apiTag: ApiTag) => ({
          id: apiTag.id.toString(),
          name: apiTag.name.trim()
        }));
        // Sort by ID descending to show newest first
        const sortedTags = convertedTags.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setTags(sortedTags);
      }
    } catch (err: any) {
      // Error handling without UI display
      console.log('Failed to load tags');
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!currentTag.trim()) {
      return; // Just return without showing error
    }

    // Check if tag already exists (case insensitive)
    const tagExists = tags.some(tag => 
      tag.name.toLowerCase() === currentTag.trim().toLowerCase()
    );

    if (tagExists) {
      setError('This tag already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const tagName = currentTag.trim();
      const response = await addTags({ name: tagName });
      
      console.log('API Response:', response);
      
      let newTag: Tag | null = null;
      
      // Handle different response formats
      if (response.success && response.data) {
        // Standard success response
        const apiTag = response.data;
        console.log('API Tag data:', apiTag);
        
        if (apiTag && apiTag.id && apiTag.name) {
          newTag = {
            id: apiTag.id.toString(),
            name: apiTag.name.trim()
          };
        }
      } else if ((response as any).id && (response as any).name) {
        // Direct response format
        console.log('Direct response format:', response);
        newTag = {
          id: (response as any).id.toString(),
          name: (response as any).name.trim()
        };
      } else {
        // Try to handle other possible formats
        console.log('Checking alternative response formats...');
        
        // Maybe the API returns different field names
        if ((response as any).id && ((response as any).tag || (response as any).tag_name)) {
          newTag = {
            id: (response as any).id.toString(),
            name: ((response as any).tag || (response as any).tag_name).trim()
          };
        }
        // Or maybe it's nested differently
        else if ((response as any).tag && (response as any).tag.id && (response as any).tag.name) {
          newTag = {
            id: (response as any).tag.id.toString(),
            name: (response as any).tag.name.trim()
          };
        }
        // If all else fails, create a temporary response and refresh
        else if ((response as any).id || (response as any).success) {
          console.log('Creating temporary tag, will refresh to get actual data');
          setCurrentTag('');
          setSuccessMessage('Tag added successfully! Refreshing list...');
          setTimeout(() => {
            loadTags();
            setSuccessMessage('');
          }, 1000);
          return;
        }
      }
      
      if (newTag) {
        // Add to local state immediately at the beginning of the array
        setTags(prev => [newTag!, ...prev]);
        setCurrentTag('');
        setSuccessMessage(`Tag "${newTag.name}" added successfully!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.log('Could not parse tag from response, refreshing list');
        setCurrentTag('');
        setTimeout(() => {
          loadTags();
        }, 2000);
      }
      
    } catch (err: any) {
      console.log('Error adding tag:', err);
      // Just continue without showing error to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    // Remove from local state immediately
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    // Note: You might want to add a delete API call here if your backend supports it
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleRefresh = () => {
    loadTags();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - All Tags */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-500" />
              All Tags ({tags.length})
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isLoadingTags}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              title="Refresh tags"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingTags ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoadingTags ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Loading tags...</p>
              </div>
            ) : tags.length > 0 ? (
              tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-md border border-green-200 hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Tag className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium truncate">{tag.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">#{tag.id}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 flex-shrink-0"
                    title="Remove tag"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Tag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No tags found</p>
                <p className="text-sm mt-1">Add your first tag to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add Tag Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            Add New Tag
          </h3>
          
          <div className="space-y-4">
            {/* Error Message - Only for duplicate tags */}
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
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tagName"
                value={currentTag}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter tag name (e.g., React, JavaScript, Frontend)"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddTag(e)}
              />
            </div>
            
            <button
              onClick={handleAddTag}
              disabled={isLoading || !currentTag.trim()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                isLoading || !currentTag.trim()
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Tag...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Tag
                </>
              )}
            </button>

            {tags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick view:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </span>
                  ))}
                  {tags.length > 10 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{tags.length - 10} more...
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

export default TagForm;