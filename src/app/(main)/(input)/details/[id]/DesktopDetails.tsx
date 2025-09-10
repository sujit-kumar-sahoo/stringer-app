'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Unlock, Lock, PenTool, User, ChevronDown, MapPin, Image as ImageIcon, Video, File } from 'lucide-react'
import withAuth from '@/hoc/withAuth';
import { getContentById, getContentByVersionId, updateContentStatus } from '@/services/contentService';
import { useParams } from 'next/navigation';
import PublishScheduleForm from "../../../../../components/ui/PublishScheduleForm"
import { useRouter } from "next/navigation";
import { useCount } from '@/context/CountContext'
import { addComments } from '@/services/activitiesService'
import useAuth from "@/hooks/useAuth";
import Link from 'next/link'

interface Comment {
  comment_text: string
  content_id: number
  created_by: number
  created_date: string
  id: number
  created_name?: string
}

interface StoryData {
  activities: Array<{
    id: string
    user: string
    action: string
    avatar: string
  }>
  comments: Comment[]
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
  /* ================ for permition start ================= */
  const { user } = useAuth();
  const router = useRouter();
  console.log('============sujit=============');
  console.log(user);
  console.log('============sujit=============');

  /*useEffect(() => {
      const permissions = user?.role_data?.route?.MENU?.["Stringer"]?.["/stories/list"] || [];
      if (!permissions.includes("add")) {
      router.push('/');
      }
  }, [user, router]);*/
  /* ================ for permition end ================= */
  const { refreshCounts } = useCount();

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'attachments' | 'activities' | 'publishAt'>('overview')

  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [activities, setActivities] = useState<StoryData>({
    activities: [], // Remove dummy data
    comments: [] // Will be populated from API
  })

  const overviewRef = useRef<HTMLDivElement>(null)
  const attachmentsRef = useRef<HTMLDivElement>(null)
  const activitiesRef = useRef<HTMLDivElement>(null)
  const publishAtRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)

  // State variables
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
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
  const [statusText, setStatusText] = useState('')
  const [statusId, setStatusId] = useState('')
  const [version, setVersion] = useState('')
  const [selectedVersion, setSelectedVersion] = useState(1)

  const [isLocked, setIsLocked] = useState(0);
  const [lockedInfo, setLockedInfo] = useState<{ locked_by: number; locked_by_name: string } | null>(null);

  useEffect(() => {
    if (id) {
      fetchContentById()
    }
  }, [id])

  const fetchContentById = async () => {
    try {
      const response = await getContentById(id)
      const data = response.data

      setIsLocked(data.locked || 0);
      setLockedInfo(data.lock || {});
      console.log('=====jjj========');
      console.log(data.lock);
      console.log(lockedInfo);
      console.log('=====jjj========');
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
      setStatusText(data.status_text || 'draft')
      setStatusId(data.status);
      const latestVersion = data.version_number || 1
      setVersion(latestVersion)
      setSelectedVersion(latestVersion)
      setActivities(prev => ({ ...prev, comments: data.comments || [] }))
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
      setStatusText(data.status_text || 'draft')

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
    if (isImage(mime)) return <ImageIcon size={48} className="text-blue-400" />
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
  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return

    setIsSubmittingComment(true)
    try {
      const commentData = {
        content_id: parseInt(id),
        comment_text: newComment.trim()
      }

      const response = await addComments(commentData)

      if (response?.data) {
        // Refresh the content to get updated comments
        await fetchContentById()
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
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
      const sections = [overviewRef.current, attachmentsRef.current, activitiesRef.current, publishAtRef.current]
      sections.forEach((section) => {
        if (section) observer.observe(section)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      const sections = [overviewRef.current, attachmentsRef.current, activitiesRef.current, publishAtRef.current]
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  const scrollToSection = (section: 'overview' | 'attachments' | 'activities' | 'publishAt') => {
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
      case 'publishAt':
        targetRef = publishAtRef
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


      const headerHeight = 160
      const targetPosition = targetRect.top - containerRect.top + scrollTop - headerHeight

      container.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      })
    }
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


  //=====================for input start========================//
  const handleReturnToReporterFromInput = async () => {
    try {
      const param = { status: "7" };
      const response = await updateContentStatus(id, param);

      if (response?.data?.success === true) {
        await refreshCounts();
        router.push(`/update/${id}`);
      } else {

        router.push(`/list/input/waitList`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      router.push(`/list/input/waitList`);
    }
  };

  const handleMoveToOutput = async () => {
    try {
      const param = { status: "3" };
      await updateContentStatus(id, param);
      await refreshCounts();
      router.push(`/list/input/waitingInOutput`);
    } catch (error: any) {
      console.error("Error:", error);
      // No alert - just redirect to a fallback page or stay on current page
      router.push(`/list/input/waitingInOutput`);
    }
  };
  //=====================for input end========================//
  //=====================for output start========================//
  const handleReturnToReporterFromOutput = async () => {
    try {
      const param = { status: "11" };
      const response = await updateContentStatus(id, param);

      if (response?.data?.success === true) {
        await refreshCounts();
        router.push(`/update/${id}`);
      } else {
        router.push(`/list/input/waitingInOutput`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      router.push(`/list/input/waitingInOutput`);
    }
  };

  const handleUnLock = async () => {
    try {
      const response = await updateContentStatus(id);
      if (response?.data?.success === true) {
        router.push(`/list/input/waitingInOutput`);
      } else {
        
      }
    } catch (error: any) {
      console.error("Error:", error);
      router.push(`/list/input/waitingInOutput`);
    }
  };

  const handleReturnToInputFromOutput = async () => {
    try {
      const param = { status: "8" };
      await updateContentStatus(id, param);
      await refreshCounts();
      router.push(`/list/input/outputToInput`);
    } catch (error: any) {
      console.error("Error:", error);
      // No alert - just redirect to a fallback page or stay on current page
      router.push(`/list/input/outputToInput`);
    }
  };
  //=====================for output end========================//

  const handleLockEdit = async () => {
    try {
      if(user?.role_name === "ROLE_INPUT")
      {
        const param = { status: "9" };
        await updateContentStatus(id, param);
      }
      if(user?.role_name === "ROLE_OUTPUT")
      {
        const param = { status: "10" };
        await updateContentStatus(id, param);
      }
      
      await refreshCounts();
      router.push(`/update/${id}`);
    } catch (error: any) {
      console.error("Error:", error);

      router.push(`/update/${id}`);
    }
  };


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
                {user?.role_name == "ROLE_INPUT" && lockedInfo?.locked_by==user?.user_id && isLocked==1 && statusId=="9" && (
                  <>
                  <Link
                    href={`/update/${id}`}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
                    <PenTool size={16} />

                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Edit
                    </span>

                  </Link>
                  {/*<button
                    type="button"
                    onClick={handleUnLock}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
                    <Unlock size={16} />

                    
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Unlock
                    </span>

                  </button>*/}
                  </>
                )}
                {user?.role_name == "ROLE_OUTPUT" && lockedInfo?.locked_by==user?.user_id && isLocked==1 && statusId=="10" && (
                  <>
                  <Link
                    href={`/update/${id}`}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
                    <PenTool size={16} />

                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Edit
                    </span>

                  </Link>
                  {/*<button
                    type="button"
                    onClick={handleUnLock}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
                    <Unlock size={16} />

                   
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Unlock
                    </span>

                  </button>*/}
                  </>
                )}
                  
                {user?.role_name === "ROLE_INPUT" && statusId == "2" ? (
                  String(selectedVersion) === String(version) ? (
                  <button
                    type="button"
                    onClick={handleLockEdit}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
                    <Lock size={16} />
                    <PenTool size={16} />

                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Lock & Edit
                    </span>

                  </button>
                ) : (
                  <div className="p-2 text-gray-400 bg-gray-100 border-2 border-gray-300 rounded-md ml-4 inline-block cursor-not-allowed">
                    <PenTool size={16} />
                  </div>
                )
                ) : null}
                {user?.role_name === "ROLE_OUTPUT" && statusId == "3" ? (
                  String(selectedVersion) === String(version) ? (
                  <button
                    type="button"
                    onClick={handleLockEdit}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
                    <Lock size={16} />
                    <PenTool size={16} />

                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Lock & Edit
                    </span>

                  </button>
                ) : (
                  <div className="p-2 text-gray-400 bg-gray-100 border-2 border-gray-300 rounded-md ml-4 inline-block cursor-not-allowed">
                    <PenTool size={16} />
                  </div>
                )
                ) : null}
                {statusId == "1" ? (
                  String(selectedVersion) === String(version) ? (
                  <Link
                    href={`/update/${id}`}
                    className="relative group p-2 text-blue-600 hover:text-blue-800 bg-blue-200 hover:bg-blue-50 border-2 border-blue-500 rounded-md transition-colors ml-4 inline-flex items-center gap-1"
                  >
   
                    <PenTool size={16} />

                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      Edit
                    </span>

                  </Link>
                ) : (
                  <div className="p-2 text-gray-400 bg-gray-100 border-2 border-gray-300 rounded-md ml-4 inline-block cursor-not-allowed">
                    <PenTool size={16} />
                  </div>
                )
                ) : null}
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
                {user?.role_name !== "ROLE_STRINGER" && (
                  <button
                    onClick={() => scrollToSection('publishAt')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'publishAt'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Publish At
                  </button>
                )}
              </nav>

              <div className="flex items-center space-x-2 pl-4">
                {user?.role_name === "ROLE_INPUT" && statusId=="2" && (
                  <>
                    <button
                      onClick={handleReturnToReporterFromInput}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      RETURN TO REPORTER
                    </button>
                    <button
                      onClick={handleMoveToOutput}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                    >
                      MOVE TO OUTPUT
                    </button>
                  </>
                )}
                {user?.role_name == "ROLE_INPUT" && lockedInfo?.locked_by==user?.user_id && isLocked==1 && statusId=="9" && (
                  <>
                    <button
                      onClick={handleReturnToReporterFromInput}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      RETURN TO REPORTER
                    </button>
                    <button
                      onClick={handleMoveToOutput}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                    >
                      MOVE TO OUTPUT
                    </button>
                  </>
                )}  
                {user?.role_name === "ROLE_OUTPUT" && statusId=="3" && (
                  <>
                    <button
                      onClick={handleReturnToReporterFromOutput}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                      RETURN TO REPORTER
                    </button>
                    <button
                      onClick={handleReturnToInputFromOutput}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium transition-colors"
                    >
                      RETURN TO INPUT
                    </button>
                  </>
                )}
                {user?.role_name == "ROLE_OUTPUT" && lockedInfo?.locked_by==user?.user_id && isLocked==1 && statusId=="10" && (
                  <>
                    <button
                      onClick={handleReturnToReporterFromOutput}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                      RETURN TO REPORTER
                    </button>
                    <button
                      onClick={handleReturnToInputFromOutput}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium transition-colors"
                    >
                      RETURN TO INPUT
                    </button>
                  </>
                )}
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
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(statusText)}`}>
                    {String(statusText || 'draft')}
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

          {/* Activities Section with Comments */}
          <div ref={activitiesRef} data-section="activities" className="bg-white shadow-sm border border-gray-200 scroll-mt-40 mb-4 rounded-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center">
                <span className="mr-2">💬</span>
                Comments ({activities.comments.length})
              </h2>

              {/* Comments Container */}
              <div className="max-h-56 overflow-y-auto space-y-4 pb-4">
                {activities.comments.map((comment, index) => {
                  // Fixed: Use === to check if comment belongs to current user
                  const isCurrentUser = comment.created_by === user.user_id;
                  const isConsecutive = index > 0 && activities.comments[index - 1].created_by === comment.created_by;

                  return (
                    <div
                      key={comment.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
                    >
                      {/* Left Avatar (for others) */}
                      {!isCurrentUser && (
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(comment.created_name || 'U').charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isCurrentUser
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                        {/* User name (only show for first message in sequence) */}
                        {!isConsecutive && !isCurrentUser && (
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            {comment.created_name || `User ${comment.created_by}`}
                          </div>
                        )}

                        {/* Message content */}
                        <div className="text-sm">
                          {comment.comment_text}
                        </div>

                        {/* Timestamp */}
                        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                          {formatDate(comment.created_date)}
                        </div>
                      </div>

                      {/* Right Avatar (for current user) */}
                      {isCurrentUser && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            You
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty state */}
              {activities.comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    💬
                  </div>
                  No comments yet
                </div>
              )}

              {/* Message input area */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    placeholder="Add a comment..."
                    disabled={isSubmittingComment}
                    rows={2}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-1"
                  >
                    {isSubmittingComment ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Section */}
          {user?.role_name !== "ROLE_STRINGER" && (
          <div ref={publishAtRef} data-section="publishAt" className="bg-white shadow-sm border border-gray-200 scroll-mt-40 mb-4 rounded-lg">
            <PublishScheduleForm contentId={id} />
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(DesktopStoryDetailView)