// Enhanced Tags Search Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface Tag {
  id: string;
  name: string;
}

interface TagsSearchProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  availableTags?: Tag[]; 
  placeholder?: string;
  maxTags?: number;
}

const TagsSearch: React.FC<TagsSearchProps> = ({
  selectedTags,
  onTagsChange,
  availableTags = [],
  placeholder = "Search or add tags...",
  maxTags = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize default tags to prevent recreation on every render
  const defaultTags = useMemo<Tag[]>(() => [
    { id: '1', name: 'Breaking News' },
    { id: '2', name: 'Politics' },
    { id: '3', name: 'Economy' },
    { id: '4', name: 'Sports' },
    { id: '5', name: 'Technology' },
    { id: '6', name: 'Health' },
    { id: '7', name: 'Education' },
    { id: '8', name: 'Environment' },
    { id: '9', name: 'Entertainment' },
    { id: '10', name: 'Business' },
    { id: '11', name: 'Science' },
    { id: '12', name: 'Culture' },
    { id: '13', name: 'International' },
    { id: '14', name: 'Local News' },
    { id: '15', name: 'Investigation' }
  ], []);

  // Memoize allTags to prevent dependency changes
  const allTags = useMemo(() => 
    availableTags.length > 0 ? availableTags : defaultTags,
    [availableTags, defaultTags]
  );

  // Memoize selected tag IDs for efficient comparison
  const selectedTagIds = useMemo(() => 
    new Set(selectedTags.map(tag => tag.id)),
    [selectedTags]
  );

  // Filter tags effect with optimized dependencies
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTagIds.has(tag.id)
      );
      setFilteredTags(filtered);
      setIsDropdownOpen(true);
    } else {
      setFilteredTags([]);
      setIsDropdownOpen(false);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, allTags, selectedTagIds]);

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
  const addTag = useCallback((tag: Tag) => {
    if (selectedTags.length < maxTags && !selectedTagIds.has(tag.id)) {
      onTagsChange([...selectedTags, tag]);
      setSearchTerm('');
      setIsDropdownOpen(false);
      inputRef.current?.focus();
    }
  }, [selectedTags, selectedTagIds, maxTags, onTagsChange]);

  const removeTag = useCallback((tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  }, [selectedTags, onTagsChange]);

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
        addTag(filteredTags[highlightedIndex]);
      } else if (searchTerm.trim() && filteredTags.length === 0) {
        // Create new tag
        const newTag: Tag = {
          id: Date.now().toString(),
          name: searchTerm.trim()
        };
        addTag(newTag);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Backspace' && !searchTerm && selectedTags.length > 0) {
      // Remove last tag when backspacing on empty input
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  }, [highlightedIndex, filteredTags, searchTerm, addTag, selectedTags, removeTag]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (searchTerm.trim()) {
      setIsDropdownOpen(true);
    }
  }, [searchTerm]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
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
          placeholder={selectedTags.length >= maxTags ? `Maximum ${maxTags} tags selected` : placeholder}
          disabled={selectedTags.length >= maxTags}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:text-gray-500"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                  onClick={() => addTag(tag)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors ${
                    index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </>
          ) : searchTerm.trim() ? (
            <button
              type="button"
              onClick={() => {
                const newTag: Tag = {
                  id: Date.now().toString(),
                  name: searchTerm.trim()
                };
                addTag(newTag);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-700 transition-colors"
            >
              <span className="text-blue-600">Create new tag:</span> "{searchTerm.trim()}"
            </button>
          ) : null}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-1">
        Search for existing tags or type to create new ones. Maximum {maxTags} tags allowed.
        {selectedTags.length > 0 && ` (${selectedTags.length}/${maxTags} selected)`}
      </p>
    </div>
  );
};

export default TagsSearch;