'use client'
import withAuth from '@/hoc/withAuth';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import { getPriorities } from '@/services/priorityService';
import { getLocations } from '@/services/locationService';
import { useCount } from '@/context/CountContext';
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Search, Grid3X3, List, MapPin, Clock, FileText, AlertCircle, Image, Video, Headphones, File, Lock, Calendar, X } from 'lucide-react'
import Pagination from '../../../../../../components/ui/pagination';
import { fetchActivities, Activity, FetchActivitiesParams } from '@/services/paginationService';

const Listing: React.FC = () => {
  const { updateCount } = useCount();
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [limit] = useState(50)
  const [error, setError] = useState<string | null>(null)
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [priorityOptions, setPriorityOptions] = useState<Array<Record<string, any>>>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(true)

  const loadActivities = async (page: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const params: FetchActivitiesParams = {
        page,
        limit,
        appliedSearchTerm,
        dateFrom,
        dateTo,
        selectedLocations,
        selectedPriorities
      }
      const data = await fetchActivities(params)
      setActivities(data.results)
      setTotalRecords(data.total_records)
      setCurrentPage(page)

      if (page === 1) {
        updateCount('waitList', data.total_records)
        console.log('Updated waitList count to:', data.total_records)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setActivities([])
      setTotalRecords(0)
    } finally {
      setIsLoading(false)
    }
  }



  const hasActiveFilters = () => {
    return !!(
      searchTerm.trim() ||
      dateFrom ||
      dateTo ||
      selectedLocations.length > 0 ||
      selectedPriorities.length > 0
    )
  }


  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true)
      const response = await getLocations()

      if (response.success && response.data && Array.isArray(response.data)) {
        const locations = response.data
          .filter((item: any) => item.location && typeof item.location === 'string')
          .map((item: any) => ({ id: item.location.trim(), name: item.location.trim() }))
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

  const fetchPriorities = async () => {
    try {
      setIsLoadingPriorities(true)
      const response = await getPriorities()

      if (response.success && response.data && Array.isArray(response.data)) {
        setPriorityOptions(response.data)
      }

    } catch (error) {
      console.error('Error fetching priorities:', error)
    } finally {
      setIsLoadingPriorities(false)
    }
  }

  useEffect(() => {
    loadActivities(1)
  }, [])

  useEffect(() => {
    fetchLocations()
    fetchPriorities()
  }, [])

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

  const applySearch = () => {
    setAppliedSearchTerm(searchTerm)
    loadActivities(1)
  }

  const clearFilters = async () => {
    setSearchTerm('')
    setAppliedSearchTerm('')
    setDateFrom('')
    setDateTo('')
    setSelectedLocations([])
    setSelectedPriorities([])


    try {
      setIsLoading(true)
      setError(null)
      const params: FetchActivitiesParams = {
        page: 1,
        limit,
        appliedSearchTerm: '',
        dateFrom: '',
        dateTo: '',
        selectedLocations: [],
        selectedPriorities: []
      }
      const data = await fetchActivities(params)
      setActivities(data.results)
      setTotalRecords(data.total_records)
      setCurrentPage(1)
      updateCount('waitList', data.total_records)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setActivities([])
      setTotalRecords(0)
    } finally {
      setIsLoading(false)
    }
  }


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
    setSelectedLocations(locationOptions.map(loc => loc.id))
  }

  const clearAllLocations = () => {
    setSelectedLocations([])
  }

  const selectAllPriorities = () => {
    setSelectedPriorities(priorityOptions.map(priority => priority.id))
  }

  const clearAllPriorities = () => {
    setSelectedPriorities([])
  }

  const handlePageChange = (page: number) => {
    loadActivities(page)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const calculateWaitingTime = (createdDate: string) => {
    const created = new Date(createdDate)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days} d, ${hours} hr, ${minutes} min`
    } else if (hours > 0) {
      return `${hours} hr, ${minutes} min`
    } else {
      return `${minutes} min`
    }
  }

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

  const renderFileTypeIcons = (attachments: any[] = []) => {
    if (!attachments || attachments.length === 0) {
      return null
    }
    const fileTypes = [...new Set(attachments.map(att => {
      const mime = att.mime?.toLowerCase() || ''

      if (mime.startsWith('image/')) return 'image'
      if (mime.startsWith('video/')) return 'video'
      if (mime.startsWith('audio/')) return 'audio'
      if (mime === 'application/pdf') return 'pdf'
      return 'document'
    }))]
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
          <span className="truncate">Date</span>
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
                onClick={() => {
                  setOpenDropdown(null)
                  if (dateFrom || dateTo) {
                    loadActivities(1)
                  }
                }}
                disabled={!dateFrom && !dateTo}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${dateFrom || dateTo
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (isLoading || isLoadingLocations || isLoadingPriorities) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Error loading data</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => loadActivities(currentPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="sticky top-0 z-20 bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row items-baseline lg:justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <DateRangeSelector />

                <MultiSelectDropdown
                  label="Location"
                  selectedItems={selectedLocations}
                  options={locationOptions}
                  onToggleItem={toggleLocationSelection}
                  onSelectAll={selectAllLocations}
                  onClearAll={clearAllLocations}
                  dropdownKey="location"
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  idKey="id"
                  displayKey="name"
                  isLoading={isLoadingLocations}
                />
                <MultiSelectDropdown
                  label="Priority"
                  selectedItems={selectedPriorities}
                  options={priorityOptions}
                  onToggleItem={togglePrioritySelection}
                  onSelectAll={selectAllPriorities}
                  onClearAll={clearAllPriorities}
                  dropdownKey="priority"
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  idKey="id"
                  displayKey="priority"
                  isLoading={isLoadingPriorities}
                />

                {(searchTerm.trim() ||
                  appliedSearchTerm ||
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

              <div>
                <div className='flex items-center gap-4'>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && hasActiveFilters() && applySearch()}
                        placeholder="Search stories..."
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64 bg-white"
                      />
                    </div>
                    <button
                      onClick={applySearch}
                      disabled={!hasActiveFilters()}
                      className={`px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${hasActiveFilters()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
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

                {totalRecords > 0 && (
                  <div className="flex justify-end mt-2">
                    <div className="w-80 float-end">
                      <Pagination
                        offset={(currentPage - 1) * limit}
                        totalRecords={totalRecords}
                        limit={limit}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto py-6">
        {/* Content Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {activities.map((activity) => {
            const waitingTime = calculateWaitingTime(activity.created_date)

            const cardContent = (
              <>
                {activity.status_text && activity.status_text.trim() !== '' ? (
                  <div className="relative">
                    <div
                      className="absolute top-0 right-0 bg-teal-600 text-white font-medium"
                      style={{
                        fontSize: "0.5rem",
                        lineHeight: "0.6rem",
                        paddingTop: "0.2rem",
                        paddingBottom: "0.2rem",
                        paddingLeft: "0.2rem",
                        paddingRight: "0.2rem",
                        borderRadius: "0px 6px"
                      }}
                    >
                      {activity.status_text}
                    </div>
                  </div>
                ) : null}

                {activity.locked ? (
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex flex-col items-center justify-center z-10">
                    <div className="bg-white p-4 rounded-full shadow-lg mb-10">
                      <Lock size={32} className="text-gray-600" />
                    </div>
                    <div
                      style={{
                        backgroundColor: "rgb(236 39 39 / 79%)",
                        color: "#fff",
                        paddingTop: "0.35rem",
                        paddingBottom: "0.35rem",
                        paddingLeft: ".45rem",
                        paddingRight: ".45rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        width: "100%",
                      }}>
                      <Lock size={10} />
                      <span
                        style={{
                          fontSize: "0.575rem",
                          lineHeight: "0.76",
                          fontWeight: 500
                        }}>
                        Locked
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className={`p-4 pt-4 ${activity.locked ? 'opacity-70' : ''}`}>
                  <div
                    className="flex items-start gap-3 mb-3"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}>
                    <div>
                      <Calendar size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-500">
                        {formatDate(activity.created_date)}
                      </div>
                    </div>
                  </div>
                  <h3
                    className="font-semibold text-gray-900 text-base leading-tight"
                    style={{
                      minHeight: "80px",
                      borderBottom: "1px solid #aba7a759",
                      marginBottom: "1px",
                      paddingBottom: "20px"
                    }}>
                    {activity.headline}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={14} />
                      <span className="text-sm">{activity.location}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">priority</div>
                      <div className={`text-sm font-semibold ${getPriorityColor(activity.priority_text)}`}>
                        {activity.priority_text}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{activity.created_name}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {renderFileTypeIcons(activity.attachments)}
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
                        width: "fit-content",
                        marginLeft: "auto"
                      }}>
                      <Clock size={12} />
                      <span
                        style={{
                          fontSize: "0.575rem",
                          lineHeight: "0.76",
                          fontWeight: 500
                        }}
                      >
                        Waiting {waitingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )

            return (
              <div key={activity.id}>
                {activity.locked ? (
                  <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 overflow-hidden relative bg-gray-100`}>
                    {cardContent}
                  </div>
                ) : (
                  <Link href={`/details/${activity.id}`}>
                    <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden relative`}>
                      {cardContent}
                    </div>
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {activities.length === 0 && !isLoading && (
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

export default withAuth(Listing);