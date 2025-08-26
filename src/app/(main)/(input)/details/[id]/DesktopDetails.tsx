'use client'
import React, { useState, useRef, useEffect } from 'react'
import { PenTool, User, ChevronDown, MapPin, Image, Video, File } from 'lucide-react'
import withAuth from '@/hoc/withAuth';
import { getContentById, getContentByVersionId } from '@/services/contentService';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface StoryData {
  activities: Array<{
    id: string
    user: string
    action: string
    avatar: string
  }>
}

interface Location {
  id: string
  name: string
}

interface Attachment {
  path: string;
  mime: string;
}

const DesktopStoryDetailView: React.FC = () => {
  const { id } = useParams() || {};

  const [activeTab, setActiveTab] = useState<'overview' | 'attachments' | 'activities'>('overview')

  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [activities, setActivities] = useState<StoryData>({
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
  // Refs for scrolling
  const overviewRef = useRef<HTMLDivElement>(null)
  const attachmentsRef = useRef<HTMLDivElement>(null)
  const activitiesRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)

  // State variables
  const [priority, setPriority] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [locationOptions, setLocationOptions] = useState<Location | null>(null)
  const [editorData, setEditorData] = useState('')
  const [created, setCreated] = useState('')
  const [updated, setUpdated] = useState('')
  const [status, setStatus] = useState('')
  const [version, setVersion] = useState('')
  const [selectedVersion, setSelectedVersion] = useState(1)
  useEffect(() => {
    if (id) {
      fetchContentById()
    }
  }, [id])

  const fetchContentById = async () => {
    try {
      const response = await getContentById(id)
      const data = response.data

      setPriority(data.priority_text || '')
      setSelectedContentType(data.content_type_text || '')
      setTitle(data.headline || '')
      setCreator(data.created_name || '')
      setLocationOptions(data.location ? { id: data.location.id || '', name: data.location.name || data.location } : null)
      setEditorData(data.description || '')
      setSelectedTag(data.tags?.[0]?.name || '')
      setAttachments(data.attachments || [])
      setCreated(data.created_date || '')
      setUpdated(data.updated_date || '')
      setStatus(data.status_text || 'draft')
      const latestVersion = data.version_number || 1
      setVersion(latestVersion)
      setSelectedVersion(latestVersion)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }
  const handleVersionChange = async (versionNumber: any) => {
    try {
      setSelectedVersion(versionNumber)

      const response = await getContentByVersionId(id, versionNumber)
      const data = response.data


      setPriority(data.priority_text || '')
      setSelectedContentType(data.content_type_text || '')
      setTitle(data.headline || '')
      setCreator(data.created_name || '')
      setLocationOptions(data.location ? { id: data.location.id || '', name: data.location.name || data.location } : null)
      setEditorData(data.description || '')
      setSelectedTag(data.tags?.[0]?.name || '')
      setAttachments(data.attachments || [])
      setCreated(data.created_date || '')
      setUpdated(data.updated_date || '')
      setStatus(data.status_text || 'draft')

      // Close dropdown if needed
      setShowVersionDropdown(false)
    } catch (error) {
      console.error('Error fetching version data:', error)
    }
  }
  const generateVersionArray = (latestVersion: any) => {
    if (!latestVersion || latestVersion < 1) return [1]

    const versions = []
    for (let i = latestVersion; i >= 1; i--) {
      versions.push(i)
    }
    return versions
  }

  const getFileName = (path: string) => {
    return path.split('/').pop() || path
  }


  const isImage = (mime: string) => {
    return mime.startsWith('image/')
  }

  const isVideo = (mime: string) => {
    return mime.startsWith('video/')
  }


  const getFileIcon = (mime: string) => {
    if (isImage(mime)) return <Image size={48} className="text-blue-400" />
    if (isVideo(mime)) return <Video size={48} className="text-purple-400" />
    return <File size={48} className="text-gray-400" />
  }


  const getFileTypeLabel = (mime: string) => {
    if (isImage(mime)) return 'IMAGE'
    if (isVideo(mime)) return 'VIDEO'
    return 'FILE'
  }


  const getFileTypeColor = (mime: string) => {
    if (isImage(mime)) return 'bg-blue-500'
    if (isVideo(mime)) return 'bg-purple-500'
    return 'bg-gray-500'
  }

  const getStatusColor = (status: string) => {
    const statusStr = String(status || '').toLowerCase()
    switch (statusStr) {
      case 'verification pending':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'published':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'waiting in input':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
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
        rootMargin: '-260px 0px -200px 0px',
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


      const headerHeight = 260
      const targetPosition = targetRect.top - containerRect.top + scrollTop - headerHeight

      container.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      })
    }
  }

  const handleReturnToReporter = () => {
    alert('Returning to reporter...')
  }

  const handleShare = () => {
    alert('Share functionality...')
  }


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
                  <span className="text-sm font-semibold text-gray-800">{String(creator || '')}</span>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800">{locationOptions?.name || 'No location'}</span>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white transition-colors ${String(priority || '').toLowerCase() === 'high' ? 'bg-red-500 hover:bg-red-600' :
                      String(priority || '').toLowerCase() === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    {priority || 'Low'}
                  </button>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-800">{String(selectedContentType || '').toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2 pl-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-800">{String(selectedTag || '')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
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
                      {generateVersionArray(version).map((versionNumber) => (
                        <button
                          key={versionNumber}
                          onClick={() => handleVersionChange(versionNumber)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md ${selectedVersion === versionNumber ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                        >
                          v{versionNumber}
                          {versionNumber === version && (
                            <span className="ml-2 text-xs text-gray-500"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedVersion === version ? (
                  <Link
                    href={`/update/${id}`}
                    className="p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-block"
                  >
                    <PenTool size={16} />
                  </Link>
                ) : (
                  <div className="p-2 text-gray-400 bg-gray-100 border-2 border-gray-300 rounded-md ml-4 inline-block cursor-not-allowed">
                    <PenTool size={16} />
                  </div>
                )}
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
                  Attachments ({attachments?.length ?? 0})
                </button>
                 <button
                onClick={() => scrollToSection('activities')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Activities ({attachments?.length ?? 0})
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
                  <p className="text-gray-900 font-medium text-lg leading-relaxed">{String(title || 'No title set')}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3 bg-green-100 px-3 py-1 rounded-full inline-block">
                    📄 DESCRIPTION
                  </h3>
                  <div
                    className="text-gray-900 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: String(editorData || 'No description set') }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mt-6 pt-6 border-t border-gray-200">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">CREATED</h4>
                  <p className="text-gray-700">{String(created || '')}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">UPDATED</h4>
                  <p className="text-gray-700">{String(updated || '')}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">STATUS</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                    {String(status || 'draft')}
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
                  Attachments ({attachments?.length ?? 0})
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {isImage(attachment.mime) ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_CDN_URL}/${attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${attachment.path}`}
                            alt={getFileName(attachment.path)}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </a>
                      ) : isVideo(attachment.mime) ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_CDN_URL}/${attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          <video
                            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${attachment.path}`}
                            className="w-full h-full object-cover rounded-lg"
                            muted
                            preload="metadata"
                          />
                        </a>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(attachment.mime)}
                        </div>
                      )}
                    </div>
                    <div className={`absolute bottom-2 right-2 text-white px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(attachment.mime)}`}>
                      {getFileTypeLabel(attachment.mime)}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 truncate" title={getFileName(attachment.path)}>
                      {getFileName(attachment.path)}
                    </div>
                  </div>
                ))}
              </div>

              {attachments.length === 0 && (
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
                Activities ({activities.activities.length})
              </h2>
              <div className="space-y-4 pb-10">
                {activities.activities.map((activity) => (
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