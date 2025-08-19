'use client'
import withAuth from '@/hoc/withAuth';
import React, { useState, useRef, useEffect } from 'react'
import { getPriorities} from '@/services/priorityService';
import { getLocations } from '@/services/locationService'; // Fixed typo

function Create() {
  // Rich text editor state
  const [editorData, setEditorData] = useState<string>('')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const [isEmpty, setIsEmpty] = useState(true)
  const isUpdatingRef = useRef(false)

  // Form fields state
  const [priority, setPriority] = useState('')
  const [contentType, setContentType] = useState('')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [attachments, setAttachments] = useState<FileList | null>(null)

  // Priority state
  const [priorityOptions, setPriorityOptions] = useState<{value: string, label: string}[]>([])
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(true)

  // Location state
  const [locationOptions, setLocationOptions] = useState<{value: string, label: string}[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)

  // Content type options
  const contentTypeOptions = [
    { value: 'news', label: 'News' },
    { value: 'feature', label: 'Feature' },
    { value: 'interview', label: 'Interview' },
    { value: 'review', label: 'Review' },
    { value: 'opinion', label: 'Opinion' },
    { value: 'breaking', label: 'Breaking News' }
  ]

  useEffect(() => {
    setIsEditorReady(true)
    
    const handleSelectionChange = () => {
      if (!isUpdatingRef.current) {
        updateActiveFormats()
      }
    }
    
    document.addEventListener('selectionchange', handleSelectionChange)
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setIsLoadingPriorities(true)
        const response = await getPriorities()

        if (response.success && response.data && Array.isArray(response.data)) {
          // Fixed mapping to match your API response structure
          const options = response.data.map((item: any) => ({
            value: item.id.toString(), // Convert to string for consistency
            label: item.priority // Use 'priority' field from your API
          }))
          setPriorityOptions(options)
        } else {
          console.error('Invalid priorities response structure:', response)
        }
      } catch (error) {
        console.error('Error fetching priorities:', error)
      } finally {
        setIsLoadingPriorities(false)
      }
    }

    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true)
        const response = await getLocations()

        if (response.success && response.data && Array.isArray(response.data)) {
          // Fixed mapping to match your API response structure
          const options = response.data.map((item: any) => ({
            value: item.id.toString(), // Convert to string for consistency
            label: item.location.trim() // Use 'location' field and trim whitespace
          }))
          setLocationOptions(options)
        } else {
          console.error('Invalid locations response structure:', response)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setIsLoadingLocations(false)
      }
    }

    fetchPriorities()
    fetchLocations()
  }, []) 

  const updateActiveFormats = () => {
    const formats = new Set<string>()
    
    if (document.queryCommandState('bold')) formats.add('bold')
    if (document.queryCommandState('italic')) formats.add('italic')
    if (document.queryCommandState('underline')) formats.add('underline')
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul')
    if (document.queryCommandState('insertOrderedList')) formats.add('ol')
    
    setActiveFormats(formats)
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(editorRef.current)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      return preCaretRange.toString().length
    }
    return 0
  }

  const restoreSelection = (savedPosition: number) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection) return

    let charIndex = 0
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null,
    )

    let node
    while (node = walker.nextNode()) {
      const nextCharIndex = charIndex + (node.textContent?.length || 0)
      
      if (savedPosition <= nextCharIndex) {
        const range = document.createRange()
        range.setStart(node, savedPosition - charIndex)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        return
      }
      charIndex = nextCharIndex
    }

    const range = document.createRange()
    range.selectNodeContents(editorRef.current)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (editorRef.current && !isUpdatingRef.current) {
      const newContent = editorRef.current.innerHTML
      const textContent = editorRef.current.textContent || ''
      
      setIsEmpty(textContent.trim().length === 0)
      setEditorData(newContent)
    }
  }

  

  const formatText = (command: string, value?: string) => {
    if (!editorRef.current) return

    isUpdatingRef.current = true
    const savedPosition = saveSelection()
    
    editorRef.current.focus()
    document.execCommand(command, false, value)
    
    setTimeout(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        const textContent = editorRef.current.textContent || ''
        
        setEditorData(newContent)
        setIsEmpty(textContent.trim().length === 0)
        restoreSelection(savedPosition)
        updateActiveFormats()
        isUpdatingRef.current = false
      }
    }, 0)
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      formatText('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      formatText('insertImage', url)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(e.target.files)
  }

  const handleSubmit = (action: 'save' | 'upload') => {
    const formData = {
      priority,
      contentType,
      title,
      location,
      content: editorData,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      attachments: attachments ? Array.from(attachments).map(file => file.name) : []
    }
    
    console.log(`${action === 'save' ? 'Saving' : 'Uploading'} story:`, formData)
    alert(`Story ${action === 'save' ? 'saved' : 'uploaded'} successfully!`)
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setPriority('')
      setContentType('')
      setTitle('')
      setLocation('')
      setEditorData('')
      setTags('')
      setAttachments(null)
      if (editorRef.current) {
        editorRef.current.innerHTML = ''
      }
      setIsEmpty(true)
    }
  }

  const ToolbarButton: React.FC<{
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
  }> = ({ onClick, active = false, title, children }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-md text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-blue-100 text-blue-700 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  )

  if (!isEditorReady) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header matching file 1 style */}
        <div className="sticky top-0 z-20 bg-gray-50 shadow-sm">
          <div className="px-4 py-4">
            <div className="rounded-lg shadow-sm">
              <div className="animate-pulse p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - Fixed positioning and padding */}
      <div className="sticky top-0 z-20 pb-4">
        <div className="">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title */}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Add Story</h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit('upload')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Added proper padding and margin */}
      <div className="pb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Form Fields */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Priority Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isLoadingPriorities}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingPriorities ? 'Loading priorities...' : 'Select Priority'}
                  </option>
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isLoadingPriorities && (
                  <p className="text-xs text-gray-500 mt-1">Loading priority options...</p>
                )}
              </div>

              {/* Content Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">Select Content Type</option>
                  {contentTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter story title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Location Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoadingLocations}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingLocations ? 'Loading locations...' : 'Select Location'}
                  </option>
                  {locationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isLoadingLocations && (
                  <p className="text-xs text-gray-500 mt-1">Loading location options...</p>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Editor Toolbar */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-1">
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => formatText('bold')}
                  active={activeFormats.has('bold')}
                  title="Bold (Ctrl+B)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                  </svg>
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => formatText('italic')}
                  active={activeFormats.has('italic')}
                  title="Italic (Ctrl+I)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4v16m4-16v16"></path>
                  </svg>
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => formatText('underline')}
                  active={activeFormats.has('underline')}
                  title="Underline (Ctrl+U)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4v8a4 4 0 108 0V4M4 20h16"></path>
                  </svg>
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Lists */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => formatText('insertUnorderedList')}
                  active={activeFormats.has('ul')}
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => formatText('insertOrderedList')}
                  active={activeFormats.has('ol')}
                  title="Numbered List"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V6H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"></path>
                  </svg>
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Links and Media */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={insertLink}
                  title="Insert Link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                </ToolbarButton>

                <ToolbarButton
                  onClick={insertImage}
                  title="Insert Image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Block Formats */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => formatText('formatBlock', 'h1')}
                  title="Heading 1"
                >
                  <span className="text-xs font-bold">H1</span>
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => formatText('formatBlock', 'h2')}
                  title="Heading 2"
                >
                  <span className="text-xs font-bold">H2</span>
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => formatText('formatBlock', 'h3')}
                  title="Heading 3"
                >
                  <span className="text-xs font-bold">H3</span>
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => formatText('formatBlock', 'p')}
                  title="Paragraph"
                >
                  <span className="text-xs">P</span>
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Utility */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => formatText('undo')}
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                  </svg>
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => formatText('redo')}
                  title="Redo (Ctrl+Y)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path>
                  </svg>
                </ToolbarButton>
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="p-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Content
            </label>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
             
              onKeyUp={updateActiveFormats}
              onClick={updateActiveFormats}
              suppressContentEditableWarning={true}
              className="min-h-[200px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
          </div>

          {/* Additional Fields */}
          <div className="p-6 border-t border-gray-200">
            {/* Search & Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter tags separated by commas (e.g., politics, economy, breaking news)
              </p>
            </div>

            {/* Attachment Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Upload Files
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  />
                </label>
                {attachments && (
                  <span className="text-sm text-gray-600">
                    {attachments.length} file{attachments.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              {attachments && (
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Selected files:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {Array.from(attachments).map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(Create)