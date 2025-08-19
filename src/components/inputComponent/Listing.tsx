
'use client'
import withAuth from '@/hoc/withAuth';

import React, { useState, useEffect } from 'react'
import { ChevronDown, Search, Grid3X3, List, MapPin, Clock,  FileText, AlertCircle, Image, Video, Headphones, File, Lock,  Calendar , X, Check } from 'lucide-react'

interface Activity {
  id: string
  type: 'edit' | 'upload'
  user: string
  action: string
  storyTitle: string
  status: 'Input WIP' | 'Waiting in Input' | 'Published' | 'Draft'
  timestamp: string
  location: string
  priority: 'High' | 'Medium' | 'Breaking' | 'Low'
  waitingTime: string
  link?: string
  fileTypes?: ('image' | 'video' | 'document' | 'audio' | 'pdf')[]
  isLocked?: boolean
  lockedBy?: string
}

const Listing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [currentUser] = useState('Priya') 

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'upload',
      user: 'Priya',
      action: 'uploaded a story',
      storyTitle: 'Testing By Bikash2',
      status: 'Waiting in Input',
      timestamp: '11 Aug, 2025 02:53PM',
      location: 'Pipili, Kendrapada',
      priority: 'High',
      waitingTime: 'Waiting 20 hr, 40 min',
      link: '#',
      fileTypes: ['document', 'image'],
      isLocked: false
    },
    {
      id: '2',
      type: 'upload',
      user: 'Priya',
      action: 'uploaded a story',
      storyTitle: 'Father\'s Promise: ସେବିତୀଙ୍କ କାହାଣୀ ଏକ ଶପଥ...ଏଁ ପିତା ସେବିତୀଙ୍କ, ଦେଶ ହିତ ପୁତ୍ରପ୍ରସୁତା ପୁତ୍ର ସାନାଗ କଠିତ',
      status: 'Waiting in Input',
      timestamp: '02 Jun, 2025 05:14PM',
      location: 'Odisha',
      priority: 'High',
      waitingTime: 'Waiting 70 d, 18 hr, 39 min',
      link: '#',
      fileTypes: ['video', 'audio', 'document'],
      isLocked: false
    },
    {
      id: '3',
      type: 'upload',
      user: 'Priya',
      action: 'uploaded a story',
      storyTitle: 'NEW DELHI: The Bhartiya Janata Party',
      status: 'Waiting in Input',
      timestamp: '05 Jun, 2025 03:53PM',
      location: 'Odisha',
      priority: 'High',
      waitingTime: 'Waiting 67 d, 20 hr, 0 min',
      link: '#',
      fileTypes: ['pdf'],
      isLocked: true,
      lockedBy: 'Priya'
    },
    {
      id: '4',
      type: 'upload',
      user: 'Priya',
      action: 'uploaded a story',
      storyTitle: 'test 03 30 jun',
      status: 'Waiting in Input',
      timestamp: '30 Jun, 2025 04:11PM',
      location: 'Joisingha',
      priority: 'Medium',
      waitingTime: 'Waiting 42 d, 19 hr, 39 min',
      link: '#',
      fileTypes: [],
      isLocked: false
    }
  ])

  const [isLoading, setIsLoading] = useState(true)

  // Dropdown options (excluding "All" options as we now support multi-select)
  const locationOptions = ['Bhubaneswar', 'Cuttack', 'Puri', 'Berhampur', 'Rourkela', 'Sambalpur', 'Balasore', 'Angul', 'Bargarh', 'Bhadrak', 'Bolangir', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Rayagada', 'Subarnapur', 'Sundargarh', 'Pipili', 'Odisha', 'Joisingha']
  const priorityOptions = ['Breaking', 'High', 'Medium', 'Low']

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const toggleLock = (activityId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          isLocked: !activity.isLocked,
          lockedBy: !activity.isLocked ? currentUser : undefined
        }
      }
      return activity
    }))
  }

  // Helper function to parse date string to Date object
  const parseDate = (dateStr: string) => {
    // Convert "11 Aug, 2025 02:53PM" format to Date
    const parts = dateStr.split(' ')
    const day = parseInt(parts[0])
    const month = parts[1]
    const year = parseInt(parts[2])
    
    const months: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }
    
    return new Date(year, months[month], day)
  }

  const applySearch = () => {
    setAppliedSearchTerm(searchTerm)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setAppliedSearchTerm('')
    setDateFrom('')
    setDateTo('')
    setSelectedLocations([])
    setSelectedPriorities([])
  }

  // Multi-select handlers
  const toggleLocationSelection = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
  }

  const togglePrioritySelection = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  const selectAllLocations = () => {
    setSelectedLocations(locationOptions)
  }

  const clearAllLocations = () => {
    setSelectedLocations([])
  }

  const selectAllPriorities = () => {
    setSelectedPriorities(priorityOptions)
  }

  const clearAllPriorities = () => {
    setSelectedPriorities([])
  }

  // Filter activities
  const getFilteredActivities = () => {
    let filtered = activities.filter(activity => {
      // Search filter (using applied search term)
      const searchMatch = !appliedSearchTerm ||
        activity.storyTitle.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(appliedSearchTerm.toLowerCase())

      // Date range filter
      let dateMatch = true
      if (dateFrom || dateTo) {
        const activityDate = parseDate(activity.timestamp)
        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          dateMatch = dateMatch && activityDate >= fromDate
        }
        if (dateTo) {
          const toDate = new Date(dateTo)
          toDate.setHours(23, 59, 59, 999) // Include the entire "to" date
          dateMatch = dateMatch && activityDate <= toDate
        }
      }

      // Location filter - if no locations selected, show all
      const locationMatch = selectedLocations.length === 0 || 
        selectedLocations.includes(activity.location)

      // Priority filter - if no priorities selected, show all
      const priorityMatch = selectedPriorities.length === 0 || 
        selectedPriorities.includes(activity.priority)

      return searchMatch && dateMatch && locationMatch && priorityMatch
    })

    return filtered
  }

  const filteredActivities = getFilteredActivities()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-orange-600'
      case 'Medium':
        return 'text-yellow-600'
      case 'Breaking':
        return 'text-red-600'
      case 'Low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    const baseStyle = "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"

    switch (fileType) {
      case 'image':
        return <div className={`${baseStyle} bg-green-500`}>
          <Image size={10} />
        </div>
      case 'video':
        return <div className={`${baseStyle} bg-blue-500`}>
          <Video size={10} />
        </div>
      case 'audio':
        return <div className={`${baseStyle} bg-purple-500`}>
          <Headphones size={10} />
        </div>
      case 'pdf':
        return <div className={`${baseStyle} bg-red-500`}>
          <File size={10} />
        </div>
      case 'document':
      default:
        return <div className={`${baseStyle} bg-orange-500`}>
          <FileText size={10} />
        </div>
    }
  }

  const renderFileTypeIcons = (fileTypes: string[] = []) => {
    if (!fileTypes || fileTypes.length === 0) {
      return null
    }

    return (
      <div className="flex items-center" style={{ gap: '-6px' }}>
        {fileTypes.slice(0, 4).map((fileType, index) => (
          <div 
            key={index}
            style={{ 
              marginLeft: index > 0 ? '-6px' : '0',
              zIndex: fileTypes.length - index 
            }}
          >
            {getFileTypeIcon(fileType)}
          </div>
        ))}
        {fileTypes.length > 4 && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-500 text-white text-xs font-medium"
            style={{ 
              marginLeft: '-6px',
              zIndex: 0 
            }}
          >
            +{fileTypes.length - 4}
          </div>
        )}
      </div>
    )
  }

  const MultiSelectDropdown = ({ 
    label, 
    selectedItems, 
    options, 
    onToggleItem, 
    onSelectAll, 
    onClearAll,
    dropdownKey 
  }: {
    label: string
    selectedItems: string[]
    options: string[]
    onToggleItem: (item: string) => void
    onSelectAll: () => void
    onClearAll: () => void
    dropdownKey: string
  }) => (
    <div className="relative dropdown-container">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey)
        }}
        className="flex items-center justify-between space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 min-w-[140px] transition-colors"
      >
        <span className="truncate">
          {selectedItems.length === 0 
            ? label 
            : selectedItems.length === 1 
              ? selectedItems[0]
              : `${selectedItems.length} selected`}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`} />
      </button>

      {openDropdown === dropdownKey && (
        <div className="absolute z-30 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {/* Select All / Clear All buttons */}
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectAll()
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Select All
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClearAll()
                }}
                className="text-xs text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
          
          {/* Options list */}
          {options.map((option) => (
            <div
              key={option}
              onClick={(e) => {
                e.stopPropagation()
                onToggleItem(option)
              }}
              className={`flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors ${
                selectedItems.includes(option) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4 mr-3">
                {selectedItems.includes(option) && (
                  <Check size={14} className="text-blue-600" />
                )}
              </div>
              <span className={`flex-1 ${selectedItems.includes(option) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const DateRangeSelector = () => (
    <div className="relative dropdown-container">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpenDropdown(openDropdown === 'dateRange' ? null : 'dateRange')
        }}
        className="flex items-center justify-between space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 min-w-[140px] transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Calendar size={16} />
          <span className="truncate">Date Range</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'dateRange' ? 'rotate-180' : ''}`} />
      </button>

      {openDropdown === 'dateRange' && (
        <div className="absolute z-30 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                  setOpenDropdown(null)
                }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setOpenDropdown(null)}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex space-x-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                <DateRangeSelector />
                <MultiSelectDropdown
                  label="By Location"
                  selectedItems={selectedLocations}
                  options={locationOptions}
                  onToggleItem={toggleLocationSelection}
                  onSelectAll={selectAllLocations}
                  onClearAll={clearAllLocations}
                  dropdownKey="location"
                />
                <MultiSelectDropdown
                  label="By Priority"
                  selectedItems={selectedPriorities}
                  options={priorityOptions}
                  onToggleItem={togglePrioritySelection}
                  onSelectAll={selectAllPriorities}
                  onClearAll={clearAllPriorities}
                  dropdownKey="priority"
                />
                
                {/* Conditional Clear Filters Button */}
                {(appliedSearchTerm || 
                  dateFrom || 
                  dateTo || 
                  selectedLocations.length > 0 || 
                  selectedPriorities.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-2xl hover:bg-red-50 transition-colors bg-red-100"
                  >
                    <div className="flex items-center gap-2">
                      <X size={16} />
                      <span>Clear Filters</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Search and View Toggle */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applySearch()}
                      placeholder="Search stories..."
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64 bg-white"
                    />
                  </div>
                  <button
                    onClick={applySearch}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto py-6">
       

        {/* Content Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredActivities.map((activity) => {
            return (
              <div
                key={activity.id}
                className={`bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden relative ${activity.isLocked ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  if (!activity.isLocked) {
                    console.log('Card clicked:', activity.id);
                  }
                }}
              >
                {/* Status Badge - positioned at top right */}
                <div className="relative">
                  <div
                    className="absolute top-0 right-0 bg-teal-600 text-white font-medium"
                    style={{
                      fontSize: "0.5rem",
                      lineHeight: "0.6rem",
                      paddingTop: "0.2rem",
                      paddingBottom: "0.2rem",
                      paddingLeft: "0.2rem",
                      paddingRight: "0.2rem"
                    }}
                  >
                    Waiting in Input
                  </div>
                </div>

                {/* Lock Overlay */}
                {activity.isLocked && (
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-10">
                    <div className="bg-white p-4 rounded-full shadow-lg">
                      <Lock size={32} className="text-gray-600" />
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className={`p-4 pt-4 ${activity.isLocked ? 'opacity-70' : ''}`}>
                  {/* Header with Icon and Date */}
                  <div
                    className="flex items-start gap-3 mb-3"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-calendar"
                        aria-hidden="true"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-500">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-semibold text-gray-900 text-base leading-tight"
                    style={{
                      minHeight: "80px",
                      borderBottom: "1px solid #aba7a759",
                      marginBottom: "1px",
                      paddingBottom: "20px"
                    }}
                  >
                    {activity.storyTitle}
                  </h3>

                  {/* Location and Priority */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={14} />
                      <span className="text-sm">{activity.location}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">priority</div>
                      <div className={`text-sm font-semibold ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </div>
                    </div>
                  </div>

                  {/* Author and File Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{activity.user}</span>
                    </div>
                  </div>

                  {/* Waiting Time and Lock Status */}
                  <div style={{display: "flex",justifyContent: "space-between", alignItems: "center",}}>
                    {renderFileTypeIcons(activity.fileTypes)}
                    
                    {activity.isLocked ? (
                      <div
                        style={{
                          backgroundColor: "#dc2626", 
                          color: "#fff", 
                          borderRadius: "1.375rem", 
                          paddingTop: "0.35rem",
                          paddingBottom: "0.35rem",
                          paddingLeft: ".45rem",
                          paddingRight: ".45rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          width: "fit-content"
                        }}
                      >
                        <Lock size={10} />
                        <span
                          style={{
                            fontSize: "0.575rem",
                            lineHeight: "0.76",
                            fontWeight: 500
                          }}
                        >
                          Locked by {activity.lockedBy}
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "#dc2626", 
                          color: "#fff", 
                          borderRadius: "1.375rem", 
                          paddingTop: "0.35rem",
                          paddingBottom: "0.35rem",
                          paddingLeft: ".45rem",
                          paddingRight: ".45rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          width: "fit-content"
                        }}
                      >
                        <Clock size={12} />
                        <span
                          style={{
                            fontSize: "0.575rem",
                            lineHeight: "0.76",
                            fontWeight: 500
                          }}
                        >
                          Waiting {activity.waitingTime.replace('Waiting ', '')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-6">
              <AlertCircle size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No stories found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(Listing)