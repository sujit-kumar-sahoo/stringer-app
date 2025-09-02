'use client'
import withAuth from '@/hoc/withAuth';
import React, { useState, useRef, useEffect } from 'react'
import { getPriorities } from '@/services/priorityService';
import { getTags } from '@/services/tagService';
import { getLocations } from '@/services/locationService';
import { getContentTypes } from '@/services/contentTypeService';
import { createContent } from '@/services/contentService';
import { getPresignedUrl, uploadToS3 } from "@/services/uploadService";
import { useCount } from '@/context/CountContext'
import TagsSearch from "../../../components/ui/TagSearchComponent"
import LocationSearch from "../../../components/ui/LocationSearchComponent"
import { showAlert, showConfirmation } from "@/utils/alert";
interface FileWithMeta {
  file: File;
  previewUrl: string;
  progress: number;
  uploadedUrl?: string;
  s3Key?: string;
}
interface Tag {
  id: string;
  name: string;
  selectedTag: Tag | null;
  onTagChange: (tag: Tag | null) => void;
  availableTags: Tag[];
  isLoading?: boolean;
  placeholder?: string;
}

function Create() {
   const { refreshCounts } = useCount();
  // Rich text editor state
  const [editorData, setEditorData] = useState<string>('')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const [isEmpty, setIsEmpty] = useState(true)
  const isUpdatingRef = useRef(false)

  // Form fields state
  const [priority, setPriority] = useState('')
  
  const [title, setTitle] = useState('')
  interface Location {
    id: string;
    name: string;
  }
 
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
   const [tagOptions, setTagOptions] = useState<Tag[]>([])
 const [isLoadingTags, setIsLoadingTags] = useState(true)


  const [priorityOptions, setPriorityOptions] = useState<{ value: string, label: string }[]>([])
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(true)


  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationOptions, setLocationOptions] = useState<Location[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)


  // content type state
  interface ContentType {
    id: string;
    content_type: string;
  }
  const [selectedContentType, setSelectedContentType] = useState('')
  const [contentTypeOptions, setContentTypeOptions] = useState<ContentType[]>([])
  const [isLoadingContentType, setIsLoadingContentType] = useState(true)

 


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
          const locations = response.data
            .filter((item: any) => item.location && typeof item.location === 'string') // Filter out invalid entries
            .map((item: any) => ({
              id: item.id.toString(),
              name: item.location.trim()
            }))
          setLocationOptions(locations)
        } else {
          console.error('Invalid locations response structure:', response)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setIsLoadingLocations(false)
      }
    }

    const fetchContentTypes = async () => {
      try {
        setIsLoadingContentType(true)
        const response = await getContentTypes()

        if (response.success && response.data && Array.isArray(response.data)) {
          // Fixed mapping to match your API response structure
          const content_types = response.data
            .filter((item: any) => item.content_type && typeof item.content_type === 'string') // Filter out invalid entries
            .map((item: any) => ({
              id: item.id.toString(),
              content_type: item.content_type.trim()
            }))
          setContentTypeOptions(content_types)
        } else {
          console.error('Invalid locations response structure:', response)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setIsLoadingLocations(false)
      }
    }
 const fetchTags = async () => {
  try {
    setIsLoadingTags(true) // ✅ Correct loading state
    const response = await getTags()

    if (response.success && response.data && Array.isArray(response.data)) {
      const tags = response.data
        .filter((item: any) => item.name && typeof item.name === 'string') // ✅ Correct field
        .map((item: any) => ({
          id: item.id.toString(),
          name: item.name.trim() // ✅ Correct field name
        }))
      setTagOptions(tags) // ✅ Set correct state
    } else {
      console.error('Invalid tags response structure:', response) // ✅ Correct error message
    }
  } catch (error) {
    console.error('Error fetching tags:', error) // ✅ Correct error message
  } finally {
    setIsLoadingTags(false) // ✅ Correct loading state
  }
}
    
    fetchTags()
    fetchPriorities()
    fetchLocations()
    fetchContentTypes()
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

  /*const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(e.target.files)
  }*/
  const [loading, setLoading] = useState<null | "save" | "draft">(null);
  const isFormValid = priority &&
                      selectedContentType &&
                      selectedLocation?.name &&
                      title &&
                      editorData;

  const handleSubmit = async (action: 'save' | 'draft') => {
    setLoading(action); // 🔹 Start loader for clicked button
    
    const attachment = files
      .filter((f) => f.uploadedUrl)
      .map((f) => ({ url: f.uploadedUrl }));

    const status = action === 'save' ? 2 : 1;

    try {
      //const formData = new FormData();
      //formData.append('username', username);
      const formData = {
        priority,
        content_type: selectedContentType,
        location: selectedLocation?.name || '',
        tags: selectedTag?.name || '',
        headline: title,
        description: editorData,
        attachments: attachment,
        status,
      };

      const authResult = await createContent(formData);

      if (authResult.success) {
        handleCancel();
        showAlert("Success", "Saved successfully!", "success");
        await refreshCounts();
        // ✅ Update auth context immediately
      } else {
        // setError(authResult?.message || 'Invalid credentials.');
        // setLoading(false);
      }
    } catch (error: any) {
      console.error(error?.message || "Submit failed.");
    } finally {
      setLoading(null); // 🔹 Stop loader after API call
    }
  };

  const handleCancel = () => {
    //if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setPriority('')
      setSelectedContentType('')
      setTitle('')
      setSelectedLocation(null)
      setEditorData('')
      setSelectedTag(null)
      setFiles([])
      if (editorRef.current) {
        editorRef.current.innerHTML = ''
      }
      setIsEmpty(true)
    }
  //}

  const ToolbarButton: React.FC<{
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
  }> = ({ onClick, active = false, title, children }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-md text-sm font-medium transition-all duration-200 ${active
        ? 'bg-blue-100 text-blue-700 shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  )


  //===================file upload start===============//
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles((prev) => {
      const existingFileNames = new Set(prev.map(f => f.file.name));
      const newFiles = selectedFiles
        .filter(file => !existingFileNames.has(file.name))
        .map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
          progress: 0,
        }));
      return [...prev, ...newFiles];
    });
  };


  const handleRemoveFile = async (index: number) => {
    const fileToRemove = files[index];

    // Delete from S3 if uploaded
    if (fileToRemove.uploadedUrl && fileToRemove.s3Key) {
      try {
        await fetch('/api/delete-from-s3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fileToRemove.s3Key }),
        });
      } catch (err) {
        console.error('Error deleting from S3:', err);
      }
    }

    // Revoke preview URL and remove from list
    URL.revokeObjectURL(fileToRemove.previewUrl);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      const fileMeta = updatedFiles[i];

      // Skip already uploaded files
      if (fileMeta.uploadedUrl) continue;

      try {
        const presigned = await getPresignedUrl(fileMeta.file.name, fileMeta.file.type);

        const formData = new FormData();
        Object.entries(presigned.fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append("file", fileMeta.file);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", presigned.url);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = (e.loaded / e.total) * 100;
              setFiles((prev) =>
                prev.map((f, idx) =>
                  idx === i ? { ...f, progress: percent } : f
                )
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status === 204) {
              const uploadedUrl = `${presigned.fields.key}`;
              setFiles((prev) =>
                prev.map((f, idx) =>
                  idx === i ? { ...f, uploadedUrl, s3Key: uploadedUrl } : f
                )
              );
              resolve();
            } else {
              reject("Upload failed");
            }
          };

          xhr.onerror = () => reject("XHR Error");
          xhr.send(formData);
        });
      } catch (err) {
        console.error(`Upload failed for ${fileMeta.file.name}`, err);
      }
    }
  };
  //===================file upload end ===============//

  if (!isEditorReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <div className="sticky top-0 z-20 bg-gray-50 p-4 flex-shrink-0">
        <div>
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
                  onClick={() => handleSubmit("draft")}
                  disabled={!isFormValid || loading !== null}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                    isFormValid && !loading
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-400 cursor-not-allowed"
                  }`}
                >
                  {loading === "draft" ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Draft Story"
                  )}
                </button>

                {/* Create Button */}
                <button
                  onClick={() => handleSubmit("save")}
                  disabled={!isFormValid || loading !== null}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                    isFormValid && !loading
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-400 cursor-not-allowed"
                  }`}
                >
                  {loading === "save" ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Create Story"
                  )}
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Added proper padding and margin */}
      <div className="flex-1 py-2 px-4 overflow-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Form Fields */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Priority Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority<sup className="text-red-500">*</sup>
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
                  Content Type<sup className="text-red-500">*</sup>
                </label>
                <select
                  value={selectedContentType}
                  onChange={(e) => setSelectedContentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">Select Content Type</option>
                  {contentTypeOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.content_type}
                    </option>
                  ))}
                </select>
               
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <LocationSearch
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                availableLocations={locationOptions}
                isLoading={isLoadingLocations}
                placeholder="Search or add location..."
              />


             <TagsSearch
  selectedTag={selectedTag}
  onTagChange={setSelectedTag}
  availableTags={tagOptions}
  isLoading={isLoadingTags} 
  placeholder="Choose a tag..."
/>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title<sup className="text-red-500">*</sup>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter story title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
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
              Story Content<sup className="text-red-500">*</sup>
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

            {/* Attachment Upload */}
            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Attachment
              </label>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* LEFT: Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative block w-full cursor-pointer appearance-none rounded border border-dashed border-orange-400 bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    multiple
                    accept="audio/*,image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    className="absolute inset-0 z-50 h-full w-full opacity-0"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      📁
                    </span>
                    <p>
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1.5">JPG, PNG, MP4, PDF, DOCX</p>
                    <p>(Multiple files allowed)</p>
                  </div>
                </div>

                {/* RIGHT: File list & progress */}
                <div className="flex flex-col gap-4 overflow-y-auto max-h-96">
                  <div className="max-h-54 overflow-y-auto pr-2 space-y-4">
                    {files.map((f, idx) => (
                      <div key={idx} className="relative flex items-center gap-4">
                        {/* ❌ Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="absolute -right-2 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-primary text-xs hover:bg-red-600"
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                          </svg>
                        </button>

                        {f.file.type.startsWith('image') ? (
                          <img
                            src={f.previewUrl}
                            alt="preview"
                            className="h-16 w-16 rounded object-cover border border-gray-300"
                          />
                        ) : f.file.type.startsWith('video') ? (
                          <video
                            src={f.previewUrl}
                            className="h-16 w-16 rounded border border-gray-300"
                            muted
                            loop
                          />
                        ) : f.file.type.startsWith('audio') ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-file-earmark-music-fill h-12 w-12 "
                            viewBox="0 0 16 16"
                          >
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14s-.974-.134-1.338-.377C5.302 13.383 5 12.995 5 12.5s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-file-text h-12 w-12 "
                            viewBox="0 0 16 16"
                          >
                            <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                          </svg>
                        )}

                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{f.file.name}</p>
                          <progress
                            value={f.progress}
                            max={100}
                            className="w-full h-2 rounded [&::-webkit-progress-value]:bg-primary"
                          />
                          {f.uploadedUrl && (
                            <a
                              href={f.uploadedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600"
                            >
                              View uploaded file
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={files.length === 0}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Upload Files
                  </button>

                </div>
              </div>
            </div>
            <div className="pb-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(Create)