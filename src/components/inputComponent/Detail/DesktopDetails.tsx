'use client'
import React, { useState, useRef, useEffect } from 'react'
import { PenTool, User, ChevronDown, FileText, MapPin } from 'lucide-react'
import withAuth from '@/hoc/withAuth';

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

const DesktopStoryDetailView: React.FC = () => {
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

  // Story data
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


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = null
        let maxRatio = 0

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisible = entry.target.getAttribute('data-section')
          }
        })

        if (mostVisible && maxRatio > 0.3) {
          setActiveTab(mostVisible as 'overview' | 'attachments' | 'activities')
        }
      },
      {
        root: tabContainerRef.current,
        rootMargin: '-260px 0px -200px 0px', // Desktop header height
        threshold: [0, 0.3, 0.5, 0.8, 1]
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
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const scrollTop = container.scrollTop

      // Desktop header height
      const headerHeight = 260
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
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Desktop Tab Container */}
      <div
        ref={tabContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hidden"
      >
        {/* Desktop Sticky Header */}
        <div className="sticky top-0 z-20 bg-gray-50 max-w-7xl py-4">

          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4">
            {/* Desktop Info Bar - Horizontal Layout */}
            <div className="flex justify-between mb-2">
              <div className="flex items-center space-x-8 mb-4 divide-x divide-gray-300 overflow-x-auto scrollbar-hidden">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800">{storyData.author}</span>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800">{storyData.location}</span>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white transition-colors ${storyData.priority.toLowerCase() === 'high' ? 'bg-red-500 hover:bg-red-600' :
                      storyData.priority.toLowerCase() === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    {storyData.priority}
                  </button>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-800">{storyData.contentType.toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  
                  <span className="text-sm font-semibold text-gray-800">{storyData.tags}</span>
                </div>
              </div>
              <div className="flex justify-between items-center ">
                <div className="relative p-2 text-green-600 hover:text-green-800 bg-green-200 hover:bg-green-300 border-2 border-green-500 rounded-md transition-colors" ref={dropdownRef}>
                  <button
                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <span className="text-sm font-medium">v{selectedVersion}</span>
                    <ChevronDown size={14} className={`transition-transform ${showVersionDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showVersionDropdown && (
                    <div className="absolute left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-30 min-w-16">
                      {[1, 2, 3].map((version) => (
                        <button
                          key={version}
                          onClick={() => handleVersionChange(version)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md ${selectedVersion === version ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                        >
                          v{version}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4"
                >
                  <PenTool size={16} />
                </button>
              </div>
            </div>
            {/* Desktop Tab Navigation */}
            <div className="flex justify-between">

              <nav className="flex space-x-8">
                <button
                  onClick={() => scrollToSection('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection('attachments')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'attachments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Attachments ({storyData.attachments.length})
                </button>
                <button
                  onClick={() => scrollToSection('activities')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Activities ({storyData.activities.length})
                </button>
              </nav>
              <div className="flex items-center space-x-2 pl-4">


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
          </div>

        </div>

        {/* Desktop Content */}
        <div className="max-w-7xl">
          {/* Overview Section */}
          <div ref={overviewRef} data-section="overview" className="bg-white rounded-lg shadow-md border-2 border-gray-200 scroll-mt-40 mb-6">
            <div className="p-6">
            

              <div className="space-y-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3 bg-blue-100 px-3 py-1 rounded-full inline-block">
                    📝 TITLE
                  </h3>
                  <p className="text-gray-900 font-medium text-lg leading-relaxed">{storyData.title || 'No title set'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3 bg-green-100 px-3 py-1 rounded-full inline-block">
                    📄 DESCRIPTION
                  </h3>
                  <div
                    className="text-gray-900 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: storyData.description || 'No description set' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mt-6 pt-6 border-t border-gray-200">
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
          <div ref={attachmentsRef} data-section="attachments" className="bg-white rounded-lg shadow-sm border border-gray-200 scroll-mt-40 mb-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <span className="mr-2">📎</span>
                  Attachments ({storyData.attachments.length})
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-3">
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

export default withAuth(DesktopStoryDetailView)