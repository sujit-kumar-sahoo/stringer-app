// Enhanced Tag Search Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface Tag {
  id: string;
  name: string;
}

interface TagSearchProps {
  selectedTag: Tag | null;
  onTagChange: (tag: Tag | null) => void;
  availableTags?: Tag[]; 
  placeholder?: string;
  isLoading?: boolean;
}

const TagSearch: React.FC<TagSearchProps> = ({
  selectedTag,
  onTagChange,
  availableTags = [],
  placeholder = "Search tags...",
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use only provided tags (no defaults)
  const allTags = useMemo(() => availableTags, [availableTags]);

  // Filter tags effect with optimized dependencies
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allTags.filter(tag => {
        // Safety check for tag name
        const tagName = tag?.name;
        if (!tagName || typeof tagName !== 'string') {
          return false;
        }
        
        return tagName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!selectedTag || tag.id !== selectedTag.id);
      });
      setFilteredTags(filtered);
    } else {
      // When no search term, show all available tags (excluding selected)
      const unselectedTags = allTags.filter(tag => 
        !selectedTag || tag.id !== selectedTag.id
      );
      setFilteredTags(unselectedTags);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, allTags, selectedTag]);

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
  const selectTag = useCallback((tag: Tag) => {
    onTagChange(tag);
    setSearchTerm('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  }, [onTagChange]);

  const clearTag = useCallback(() => {
    onTagChange(null);
    setSearchTerm('');
    inputRef.current?.focus();
  }, [onTagChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredTags.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredTags.length) {
        selectTag(filteredTags[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Backspace' && !searchTerm && selectedTag) {
      // Clear selected tag when backspacing on empty input
      clearTag();
    }
  }, [highlightedIndex, filteredTags, selectTag, selectedTag, clearTag, searchTerm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Open dropdown when typing
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  }, [isDropdownOpen]);

  const handleInputClick = useCallback(() => {
    // Open dropdown when clicking on input
    setIsDropdownOpen(true);
  }, []);

  const handleInputFocus = useCallback(() => {
    // Open dropdown when focusing on input
    setIsDropdownOpen(true);
  }, []);

  // Display value logic similar to LocationSearch
  const displayValue = selectedTag && !searchTerm ? selectedTag.name : searchTerm;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tag
      </label>
      
      {/* Selected Tag Display */}
      {selectedTag && !searchTerm && (
        <div className="flex items-center mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {selectedTag?.name || 'Unknown Tag'}
            <button
              type="button"
              onClick={clearTag}
              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
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
          onClick={handleInputClick}
          placeholder={isLoading ? "Loading tags..." : placeholder}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:text-gray-500"
        />
        
        {/* Tag Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredTags.length > 0 ? (
            <>
              {filteredTags.map((tag, index) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => selectTag(tag)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors flex items-center ${
                    index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {tag.name}
                </button>
              ))}
            </>
          ) : searchTerm.trim() ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No tags found matching "{searchTerm.trim()}"
            </div>
          ) : allTags.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No tags available
            </div>
          ) : null}
        </div>
      )}

     
    </div>
  );
};

export default TagSearch;