import React, { useState } from 'react';
import { Plus, Tag, X } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
}

const TagForm: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const handleAddTag = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!currentTag.trim()) {
      alert('Please enter a tag name.');
      return;
    }

    // Check if tag already exists (case insensitive)
    const tagExists = tags.some(tag => 
      tag.name.toLowerCase() === currentTag.trim().toLowerCase()
    );

    if (tagExists) {
      alert('This tag already exists.');
      return;
    }

    const newTag: Tag = {
      id: Date.now().toString(),
      name: currentTag.trim()
    };

    setTags(prev => [...prev, newTag]);
    setCurrentTag('');
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - All Tags */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">All Tags</h3>
          <div className="space-y-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-md border border-green-200">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 font-medium">{tag.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                    title="Remove tag"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Tag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No tags added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add Tag Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Tag</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tagName"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter tag name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
              />
            </div>
            
            <button
              onClick={handleAddTag}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Add Tag
            </button>

            {tags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick view:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </span>
                  ))}
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