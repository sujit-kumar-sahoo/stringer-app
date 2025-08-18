
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Edit3, User, ArrowLeft, ChevronDown, FileText } from 'lucide-react'

interface StoryData {
  title: string
  description: string
  author: string
  status: 'verification pending' | 'published' | 'draft' | 'rejected'
  created: string
  updated: string
  currentVersion: number
  location: string
  priority: string
  contentType: string
  tags: string
  attachments: Array<{
    id: string
    type: 'image' | 'video' | 'document'
    url: string
    name: string
    file?: File
  }>
  activities: Array<{
    id: string
    user: string
    action: string
    timestamp: string
    avatar: string
  }>
}

interface VersionHistory {
  version: number
  title: string
  timestamp: string
  author: string
}

const StoryDetailView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attachments' | 'activities'>('overview')
  const [selectedVersion, setSelectedVersion] = useState<number>(3)
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)

  // Refs for scrolling
  const overviewRef = useRef<HTMLDivElement>(null)
  const attachmentsRef = useRef<HTMLDivElement>(null)
  const activitiesRef = useRef<HTMLDivElement>(null)


  // Version history data
  const versionHistory: VersionHistory[] = [
    { version: 3, title: 'Local Infrastructure Development Updates', timestamp: 'Dec 12, 2024, 2:15 PM', author: 'You' },
    { version: 2, title: 'Local Infrastructure Development Updates - Draft', timestamp: 'Dec 11, 2024, 11:20 AM', author: 'You' },
    { version: 1, title: 'Infrastructure Updates', timestamp: 'Dec 10, 2024, 9:30 AM', author: 'You' }
  ]

  // Initial story data with populated fields
  const [storyData, setStoryData] = useState<StoryData>({
    title: 'Local Infrastructure Development Updates',
    description: '<h2>Major Infrastructure Projects Underway</h2><p>The city administration has announced several key infrastructure development projects that are set to transform the urban landscape over the next two years.</p><p><strong>Key highlights include:</strong></p><ul><li>New metro line extension covering 15 kilometers</li><li>Smart traffic management system implementation</li><li>Green energy initiatives for public buildings</li><li>Water supply network modernization</li></ul><p>These projects are expected to improve the quality of life for over 2 million residents while creating thousands of job opportunities in the construction and technology sectors.</p>',
    author: 'Soumen Kumar',
    status: 'draft',
    created: 'Dec 10, 2024, 9:30 AM',
    updated: 'Dec 12, 2024, 2:15 PM',
    currentVersion: 3,
    location: 'Kolkata',
    priority: 'High',
    contentType: 'news',
    tags: 'Politics',
    attachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
        name: 'construction-site.jpg'
      },
      {
        id: '2',
        type: 'document',
        url: '#',
        name: 'project-proposal.pdf'
      },
      {
        id: '3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
        name: 'metro-blueprint.jpg'
      }
    ],
    activities: [
      {
        id: '1',
        user: 'You',
        action: 'updated story to version 3',
        timestamp: 'Dec 12, 2024, 2:15 PM',
        avatar: 'Y'
      },
      {
        id: '2',
        user: 'Editor',
        action: 'reviewed and provided feedback',
        timestamp: 'Dec 11, 2024, 4:30 PM',
        avatar: 'E'
      },
      {
        id: '3',
        user: 'You',
        action: 'updated story to version 2',
        timestamp: 'Dec 11, 2024, 11:20 AM',
        avatar: 'Y'
      },
      {
        id: '4',
        user: 'You',
        action: 'created story',
        timestamp: 'Dec 10, 2024, 9:30 AM',
        avatar: 'Y'
      }
    ]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verification pending':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'published':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Intersection Observer to track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id) {
              setActiveTab(id as 'overview' | 'attachments' | 'activities')
            }
          }
        })
      },
      {
        rootMargin: '-150px 0px -50% 0px',
        threshold: 0.3
      }
    )

    const timeoutId = setTimeout(() => {
      const sections = [overviewRef.current, attachmentsRef.current, activitiesRef.current]
      sections.forEach((section) => {
        if (section) observer.observe(section)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      const sections = [overviewRef.current, attachmentsRef.current, activitiesRef.current]
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  const scrollToSection = (section: 'overview' | 'attachments' | 'activities') => {
    let targetRef
    switch (section) {
      case 'overview':
        targetRef = overviewRef
        break
      case 'attachments':
        targetRef = attachmentsRef
        break
      case 'activities':
        targetRef = activitiesRef
        break
      default:
        return
    }

    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      
      setTimeout(() => {
        const headerHeight = window.innerWidth >= 768 ? 200 : 280
        const currentScrollY = window.pageYOffset
        const elementTop = targetRef.current!.getBoundingClientRect().top + currentScrollY
        const offsetPosition = elementTop - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  const handleEdit = () => {
    alert('Redirecting to edit page...')
  }

  const handleVersionChange = (version: number) => {
    setSelectedVersion(version)
    setShowVersionDropdown(false)
    alert(`Loading version ${version}...`)
  }

  const handleReturnToReporter = () => {
    alert('Returning to reporter...')
  }

  const handleShare = () => {
    alert('Share functionality...')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVersionDropdown) {
        setShowVersionDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showVersionDropdown])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-50 border-b-2 border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-0 md:px-4 py-3 sm:py-4">
          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3 px-3">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <button className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {storyData.title}
                </h1>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-2 mb-3 px-3">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium transition-colors"
                  >
                    <span>Version {selectedVersion}</span>
                    <ChevronDown size={16} className={`transition-transform ${showVersionDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showVersionDropdown && (
                    <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-100">
                          Previous Versions
                        </div>
                        {versionHistory.map((version) => (
                          <button
                            key={version.version}
                            onClick={() => handleVersionChange(version.version)}
                            className={`w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
                              selectedVersion === version.version ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  Version {version.version}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {version.title}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {version.timestamp} by {version.author}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleReturnToReporter}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  RETURN TO REPORTER
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  SHARE
                </button>
              </div>
            </div>

            {/* Mobile Story Info */}
            <div className="bg-white rounded-none shadow-sm border-l-0 border-r-0 border-t border-b border-gray-200 p-3">
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center space-x-1">
                  <User size={12} className="text-gray-500" />
                  <span className="font-semibold text-gray-800 truncate">{storyData.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="font-semibold text-gray-800">{storyData.location}</span>
                </div>
                <div>
                  <span className="text-gray-600">Priority: </span>
                  <span className="font-semibold text-gray-800">{storyData.priority}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type: </span>
                  <span className="font-semibold text-gray-800 capitalize">{storyData.contentType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tags: </span>
                  <span className="font-semibold text-gray-800">{storyData.tags}</span>
                </div>
                <div>
                  <span className="text-gray-600">Version: </span>
                  <span className="font-semibold text-gray-800">{storyData.currentVersion}</span>
                </div>
              </div>

              {/* Mobile Tab Navigation - Always visible */}
              <div className="border-t pt-3 mt-3">
                <nav className="flex space-x-4 overflow-x-auto">
                  <button
                    onClick={() => scrollToSection('overview')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'overview' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection('attachments')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'attachments' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Attachments ({storyData.attachments.length})
                  </button>
                  <button
                    onClick={() => scrollToSection('activities')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'activities' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Activities ({storyData.activities.length})
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {storyData.title}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Version Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium transition-colors"
                  >
                    <span>Version {selectedVersion}</span>
                    <ChevronDown size={16} className={`transition-transform ${showVersionDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showVersionDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-100">
                          Previous Versions
                        </div>
                        {versionHistory.map((version) => (
                          <button
                            key={version.version}
                            onClick={() => handleVersionChange(version.version)}
                            className={`w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
                              selectedVersion === version.version ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  Version {version.version}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-48">
                                  {version.title}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 ml-2">
                                {version.timestamp}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              by {version.author}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleReturnToReporter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  RETURN TO REPORTER
                </button>
                <button 
                  onClick={handleShare}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  SHARE
                </button>
              </div>
            </div>

            {/* Desktop Story Metadata */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4">
              <div className="flex items-center space-x-8 mb-4 divide-x divide-gray-300 overflow-x-auto">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800">{storyData.author}</span>
                </div>
                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-semibold text-gray-800">{storyData.location}</span>
                </div>
                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-600">Priority:</span>
                  <span className="text-sm font-semibold text-gray-800">{storyData.priority}</span>
                </div>
                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <span className="text-sm font-semibold text-gray-800 capitalize">{storyData.contentType}</span>
                </div>
                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-600">Tags:</span>
                  <span className="text-sm font-semibold text-gray-800">{storyData.tags}</span>
                </div>
                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-800">Version {storyData.currentVersion}</span>
                </div>
              </div>

              {/* Desktop Tab Navigation */}
              <div className="border-b-2 border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => scrollToSection('overview')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'overview' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection('attachments')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'attachments' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Attachments ({storyData.attachments.length})
                  </button>
                  <button
                    onClick={() => scrollToSection('activities')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'activities' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Activities ({storyData.activities.length})
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-0 md:px-4 py-4 sm:py-6">
        
        {/* Overview Section */}
        <div ref={overviewRef} data-section="overview" className="bg-white rounded-none md:rounded-lg shadow-md border-l-0 border-r-0 md:border-l-2 md:border-r-2 border-t-2 border-b-2 md:border-2 border-gray-200 scroll-mt-40 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                <span className="mr-2 text-xl sm:text-2xl">📋</span>
                Overview
              </h2>
              <button 
                onClick={handleEdit}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md text-sm"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
                
            <div className="space-y-6 sm:space-y-8">
              {/* Title Section */}
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wide mb-3 bg-blue-100 px-3 py-1 rounded-full inline-block">
                  📝 TITLE
                </h3>
                <p className="text-gray-900 font-medium text-base sm:text-lg leading-relaxed">{storyData.title || 'No title set'}</p>
              </div>

              {/* Description Section */}
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xs sm:text-sm font-bold text-green-700 uppercase tracking-wide mb-3 bg-green-100 px-3 py-1 rounded-full inline-block">
                  📄 DESCRIPTION
                </h3>
                <div 
                  className="text-gray-900 prose prose-sm sm:prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: storyData.description || 'No description set' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-6 pt-6 border-t border-gray-200">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">CREATED</h4>
                <p className="text-gray-700">{storyData.created}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">UPDATED</h4>
                <p className="text-gray-700">{storyData.updated}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">STATUS</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(storyData.status)}`}>
                  {storyData.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Attachments Section */}
        <div ref={attachmentsRef} data-section="attachments" className="bg-white rounded-none md:rounded-lg shadow-sm border-l-0 border-r-0 md:border border-t border-b border-gray-200 scroll-mt-40 mb-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                <span className="mr-2">📎</span>
                Attachments ({storyData.attachments.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {storyData.attachments.map((attachment) => (
                <div key={attachment.id} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {attachment.type === 'image' ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {attachment.type}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 truncate">{attachment.name}</div>
                </div>
              ))}
            </div>
            
            {storyData.attachments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No attachments yet
              </div>
            )}
          </div>
        </div>

        {/* Activities Section */}
        <div ref={activitiesRef} data-section="activities" className="bg-white rounded-lg shadow-sm border border-gray-200 scroll-mt-40 mb-4">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center">
              <span className="mr-2">📈</span>
              Activities ({storyData.activities.length})
            </h2>
            <div className="space-y-4">
              {storyData.activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-600 ml-1">{activity.action}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )  
}

export default StoryDetailView