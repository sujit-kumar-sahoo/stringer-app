'use client'
import React, { useState, useRef, useEffect } from 'react'
import { PenTool, User, ChevronDown, FileText, MapPin } from 'lucide-react'

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
    avatar: string
  }>
}

interface VersionHistory {
  version: number
  title: string
  author: string
}

const MobileStoryDetailView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attachments' | 'activities'>('overview')
  const [selectedVersion, setSelectedVersion] = useState<number>(3)
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)

  // Refs for scrolling
  const overviewRef = useRef<HTMLDivElement>(null)
  const attachmentsRef = useRef<HTMLDivElement>(null)
  const activitiesRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)

  // Version history data
  const versionHistory: VersionHistory[] = [
    { version: 3, title: 'Local Infrastructure Development Updates', author: 'You' },
    { version: 2, title: 'Local Infrastructure Development Updates - Draft', author: 'You' },
    { version: 1, title: 'Infrastructure Updates', author: 'You' }
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
        avatar: 'Y'
      },
      {
        id: '2',
        user: 'Editor',
        action: 'reviewed and provided feedback',
        avatar: 'E'
      },
      {
        id: '3',
        user: 'You',
        action: 'updated story to version 2',
        avatar: 'Y'
      },
      {
        id: '4',
        user: 'You',
        action: 'created story',
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
        // Find the section that's most visible
        let mostVisible = null
        let maxRatio = 0

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisible = entry.target.getAttribute('data-section')
          }
        })

        // Only update if we have a visible section and it's different from current
        if (mostVisible && maxRatio > 0.2) {
          setActiveTab(mostVisible as 'overview' | 'attachments' | 'activities')
        }
      },
      {
        root: tabContainerRef.current,
        rootMargin: '-200px 0px -200px 0px',
        threshold: [0, 0.2, 0.5, 0.8, 1]
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

    if (targetRef.current && tabContainerRef.current) {
      const container = tabContainerRef.current
      const target = targetRef.current

      // Calculate the position relative to the container
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const scrollTop = container.scrollTop

      // Account for sticky header height + additional offset
      const headerHeight = 340
      const targetPosition = targetRect.top - containerRect.top + scrollTop - headerHeight

      container.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      })
    }
  }

  const handleEdit = () => {
    alert('Redirecting to edit page...')
  }

  const handleVersionChange = (version: number) => {
    setSelectedVersion(version)
    setShowVersionDropdown(false)

    // Update story data based on selected version
    const selectedVersionData = versionHistory.find(v => v.version === version)
    if (selectedVersionData) {
      setStoryData(prev => ({
        ...prev,
        title: selectedVersionData.title,
        currentVersion: version,
      }))
    }

    console.log(`Loading version ${version}...`)
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVersionDropdown(false)
      }
    }

    if (showVersionDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showVersionDropdown])

  return (
    <div className="w-full bg-gray-50 h-screen overflow-hidden flex flex-col">
      <style jsx>{`
        .scrollbar-hidden {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>

      {/* Tab Container with isolated scrolling and hidden scrollbar */}
      <div
        ref={tabContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hidden"
      >
     
        <div className="sticky top-0 z-20 bg-white shadow-sm">
         
              <div className="flex items-center mb-3">
              <div className="flex items-center space-x-1">
                <User size={16} className="text-gray-500" />
                <span className="font-semibold text-gray-800 text-sm">{storyData.author}</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
              <div className="flex items-center space-x-1">
                <MapPin size={16} className="text-gray-500" />
                <span className="font-semibold text-gray-800 text-sm">{storyData.location}</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-semibold text-gray-800">{storyData.tags}</span>
              </div>
            </div>

          
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    storyData.priority.toLowerCase() === 'high' ? 'bg-red-500' :
                    storyData.priority.toLowerCase() === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                >
                  {storyData.priority}
                </button>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-800">{storyData.contentType.toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-1 px-2 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <PenTool size={14} />
                  <span className="text-xs font-medium">Edit</span>
                </button>
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    className="flex items-center space-x-1 px-2 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  >
                    <span className="text-xs font-medium">V{selectedVersion}</span>
                    <ChevronDown size={12} className={`transition-transform ${showVersionDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showVersionDropdown && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-30 min-w-24">
                      {[1, 2, 3].map((version) => (
                        <button
                          key={version}
                          onClick={() => handleVersionChange(version)}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            selectedVersion === version ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          V{version}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            
            <div className="flex space-x-3 mb-4"> 
  <button 
    onClick={handleReturnToReporter} 
    className="flex-1 px-2 sm:px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap" 
  > 
    RETURN TO REPORTER 
  </button> 
  <button 
    onClick={handleShare} 
    className="flex-1 px-2 sm:px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm font-semibold transition-colors" 
  > 
    SHARE 
  </button> 
</div>
            <div className="border-t pt-3">
              <nav className="flex space-x-6 overflow-x-auto scrollbar-hidden">
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

        {/* Content Sections */}
        <div className="">
          {/* Overview Section */}
          <div ref={overviewRef} data-section="overview" className="bg-white shadow-md border-t-2 border-b-2 border-gray-200 scroll-mt-40 mb-4 rounded-lg">
            <div className="p-1">
              <div className="space-y-6">
                {/* Title */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 bg-blue-100 px-3 py-1 rounded-full inline-block">
                    📝 TITLE
                  </h3>
                  <p className="text-gray-900 font-medium text-base leading-relaxed">{storyData.title || 'No title set'}</p>
                </div>

                {/* Description */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3 bg-green-100 px-3 py-1 rounded-full inline-block">
                    📄 DESCRIPTION
                  </h3>
                  <div
                    className="text-gray-900 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: storyData.description || 'No description set' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm mt-6 pt-6 border-t border-gray-200">
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
          <div ref={attachmentsRef} data-section="attachments" className="bg-white shadow-sm border-t border-b border-gray-200 scroll-mt-40 mb-4 rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <span className="mr-2">📎</span>
                  Attachments ({storyData.attachments.length})
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {storyData.attachments.map((attachment) => (
                  <div key={attachment.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {attachment.type === 'image' ? (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={28} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {attachment.type}
                    </div>
                    <div className="mt-2 text-xs text-gray-600 truncate">{attachment.name}</div>
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
          <div ref={activitiesRef} data-section="activities" className="bg-white shadow-sm border border-gray-200 scroll-mt-40 mb-4 rounded-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center">
                <span className="mr-2">📈</span>
                Activities ({storyData.activities.length})
              </h2>
              <div className="space-y-4 pb-10">
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
                      <div className="text-xs text-gray-500 mt-1">
                        Just now
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileStoryDetailView