// Single Tag Search Component
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Tag {
   id: string;
  name: string;
}

interface TagSearchProps {
  selectedTag: Tag | null;
  onTagChange: (tag: Tag | null) => void;
  availableTags?: Tag[]; 
  placeholder?: string;
}

const TagSearch: React.FC<TagSearchProps> = ({
  selectedTag,
  onTagChange,
  availableTags = [],
  placeholder = "Search or select a tag..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter tags effect
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
      setIsDropdownOpen(true);
    } else {
      // Show all available tags when no search term
      setFilteredTags(availableTags);
      setIsDropdownOpen(false);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, availableTags]);

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
    inputRef.current?.blur();
  }, [onTagChange]);

  const clearTag = useCallback(() => {
    onTagChange(null);
    setSearchTerm('');
    inputRef.current?.focus();
  }, [onTagChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      } else {
        setHighlightedIndex(prev => 
          prev < filteredTags.length - 1 ? prev + 1 : prev
        );
      }
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
      clearTag();
    }
  }, [highlightedIndex, filteredTags, selectTag, selectedTag, clearTag, isDropdownOpen, searchTerm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tag
      </label>
      
      {/* Selected Tag Display */}
      {selectedTag && (
        <div className="mb-2 flex items-center">
         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {selectedTag.name}
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
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        
        {/* Search/Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors flex items-center justify-between ${
                    index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <span>{tag.name}</span>
                  {selectedTag?.id === tag.id && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No tags found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSearch;