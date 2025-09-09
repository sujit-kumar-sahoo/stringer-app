'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Clock, Calendar, ExternalLink } from 'lucide-react'
import { getPriceTag } from '@/services/priceTag'
import { getPublish, addPublish } from '@/services/publishAt'

interface PublishScheduleItem {
  id: string;
  platform: string;
  publishTime: string;
  price_tag_id?: string;
  content_id?: string;
  price?: string;
  price_type?: string;
  updated_date?: string;
}

interface PublishScheduleFormProps {
  onScheduleAdd?: (item: PublishScheduleItem) => void;
  className?: string;
  contentId?: string;
}

interface PlatformOption {
  value: string;
  label: string;
  id?: string;
}

const PublishScheduleForm: React.FC<PublishScheduleFormProps> = ({
  onScheduleAdd,
  className = "",
  contentId
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [publishTime, setPublishTime] = useState('')
  const [publishScheduleList, setPublishScheduleList] = useState<PublishScheduleItem[]>([])
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([
    { value: '', label: 'Select Platform' }
  ])
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true)
  const [platformError, setPlatformError] = useState<string | null>(null)

  // Fetch only platform options on component mount (removed getPublish call)
  useEffect(() => {

    const fetchPlatforms = async () => {
      if (contentId) {
        try {
          const publishData = await getPublish(contentId)

          if (publishData?.success && Array.isArray(publishData.data)) {
            const existingSchedules = publishData.data.map((item: any) => ({
              id: item.id?.toString() || Date.now().toString(),
              platform: item.price_tag?.type || item.price_type || 'Unknown', // Use price_type if price_tag.type not available
              publishTime: item.publish_url_time || '',
              price_tag_id: item.price_tag_id?.toString(),
              content_id: item.content_id?.toString(),
              price: item.price || '', // Map price field
              price_type: item.price_type || '', // Map price_type field
              updated_date: item.updated_date || '' // Map updated_date field
            }))
            setPublishScheduleList(existingSchedules)
          } else if (Array.isArray(publishData)) {
            // Fallback for direct array response
            const existingSchedules = publishData.map((item: any) => ({
              id: item.id?.toString() || Date.now().toString(),
              platform: item.price_tag?.type || item.price_type || 'Unknown',
              publishTime: item.publish_url_time || '',
              price_tag_id: item.price_tag_id?.toString(),
              content_id: item.content_id?.toString(),
              price: item.price || '',
              price_type: item.price_type || '',
              updated_date: item.updated_date || ''
            }))
            setPublishScheduleList(existingSchedules)
          }
        } catch (publishError) {
          console.error('Failed to fetch existing publish schedules:', publishError)
        }
      }
      try {
        setIsLoadingPlatforms(true)
        setPlatformError(null)

        // Fetch platform options only
        const priceTagData = await getPriceTag()

        // Transform the data from getPriceTag into platform options
        const platforms: PlatformOption[] = [
          { value: '', label: 'Select Platform' }
        ]

        // Check if response has success and data properties
        if (priceTagData?.success && Array.isArray(priceTagData.data)) {
          const platformsFromData = priceTagData.data.map((item: any) => {
            return {
              value: item.type, // Using 'type' as the value (TV, ENGLISH_WEB)
              label: item.type_text, // Using 'type_text' as the display label (Tv, English web)
              id: item.id?.toString() // Using 'id' as the priceTag value
            }
          })
          platforms.push(...platformsFromData)
        } else if (Array.isArray(priceTagData)) {
          // Fallback for direct array response
          const platformsFromData = priceTagData.map((item: any) => ({
            value: item.type,
            label: item.type_text,
            id: item.id?.toString() // Using 'id' as the priceTag value
          }))
          platforms.push(...platformsFromData)
        }

        setPlatformOptions(platforms)

      } catch (error) {
        setPlatformError(`Failed to load platforms: ${error}`)
      } finally {
        setIsLoadingPlatforms(false)
      }
    }

    fetchPlatforms()
  }, []) // Removed contentId dependency since we're not fetching existing schedules

  // Function to refresh/fetch existing schedules (moved from useEffect)
  const fetchExistingSchedules = async () => {
    if (!contentId) return

    try {
      const publishData = await getPublish(contentId)

      if (publishData?.success && Array.isArray(publishData.data)) {
        const existingSchedules = publishData.data.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          platform: item.price_tag?.type || item.price_type || 'Unknown', // Use price_type if price_tag.type not available
          publishTime: item.publish_url_time || '',
          price_tag_id: item.price_tag_id?.toString(),
          content_id: item.content_id?.toString(),
          price: item.price || '', // Map price field
          price_type: item.price_type || '', // Map price_type field
          updated_date: item.updated_date || '' // Map updated_date field
        }))
        setPublishScheduleList(existingSchedules)
      } else if (Array.isArray(publishData)) {
        // Fallback for direct array response
        const existingSchedules = publishData.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          platform: item.price_tag?.type || item.price_type || 'Unknown',
          publishTime: item.publish_url_time || '',
          price_tag_id: item.price_tag_id?.toString(),
          content_id: item.content_id?.toString(),
          price: item.price || '',
          price_type: item.price_type || '',
          updated_date: item.updated_date || ''
        }))
        setPublishScheduleList(existingSchedules)
      }
    } catch (publishError) {
      console.error('Failed to fetch existing publish schedules:', publishError)
    }
  }

  // Get price_tag_id for selected platform
  const getPriceTagId = (platformValue: string): string => {
    const platform = platformOptions.find(option => option.value === platformValue)
    return platform?.id || "1" // Return the actual id from getPriceTag data
  }

  // Handle form submission (now calls getPublish after successful add)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlatform || !publishTime) {
      alert('Please select a platform and enter publish time')
      return
    }

    const priceTagId = getPriceTagId(selectedPlatform)

    // Convert publishTime to ISO string format if it's a datetime-local input
    let formattedPublishTime = publishTime
    if (selectedPlatform === 'TV' && publishTime) {
      // For datetime-local input, ensure it's in ISO format
      const date = new Date(publishTime)
      if (!isNaN(date.getTime())) {
        formattedPublishTime = date.toISOString()
      }
    }

    const newItem: PublishScheduleItem = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      publishTime: formattedPublishTime,
      price_tag_id: priceTagId,
      content_id: contentId
    }

    // Optimistically add to UI
    setPublishScheduleList(prev => [...prev, newItem])

    if (onScheduleAdd) {
      onScheduleAdd(newItem)
    }

    try {
      const apiData = {
        price_tag_id: priceTagId,
        content_id: contentId,
        publish_url_time: formattedPublishTime
      }

      const response = await addPublish(apiData)

      if (!response.success) {
        alert(`Error: ${response.message}`)
        setPublishScheduleList(prev => prev.filter(item => item.id !== newItem.id))
        return
      }

      // After successful add, fetch the updated list from server
      await fetchExistingSchedules()

    } catch (error) {
      alert('Failed to add publish schedule. Please try again.')
      setPublishScheduleList(prev => prev.filter(item => item.id !== newItem.id))
      return
    }

    setSelectedPlatform('')
    setPublishTime('')
  }

  const getPlatformLabel = (value: string) => {
    const platform = platformOptions.find(option => option.value === value)
    return platform ? platform.label : value
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    if (isNaN(date.getTime())) {
      return dateTimeString
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  const isUrl = (text: string) => {
    try {
      new URL(text)
      return true
    } catch {
      return text.startsWith('http://') || text.startsWith('https://')
    }
  }

  const isTVPlatform = selectedPlatform === 'TV'

  return (
    <div className={`p-6 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Calendar className="mr-3 text-blue-600" size={20} />
          Publish At
        </h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {publishScheduleList.length} scheduled
        </span>
      </div>

      {/* Add Schedule Form */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                id="platform"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                disabled={isLoadingPlatforms}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
              >
                {isLoadingPlatforms ? (
                  <option value="">Loading platforms...</option>
                ) : (
                  platformOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                )}
              </select>
              {platformError && (
                <p className="text-sm text-red-600 mt-1">{platformError}</p>
              )}
            </div>

            <div>
              <label htmlFor="publishTime" className="block text-sm font-medium text-gray-700 mb-2">
                Publish Time / Url
              </label>
              {isTVPlatform ? (
                <input
                  type="datetime-local"
                  id="publishTime"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              ) : (
                <input
                  type="text"
                  id="publishTime"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  placeholder="Enter publish time"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoadingPlatforms}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Schedule Table */}
      {publishScheduleList.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2 text-gray-600" size={18} />
            Scheduled Publications
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publish Time/URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publishScheduleList.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                        {item.price_type || getPlatformLabel(item.platform)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {isUrl(item.publishTime) ? (
                        <div className="flex items-center">
                          <a
                            href={item.publishTime}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center"
                            title={item.publishTime}
                          >
                            <ExternalLink className="mr-1 flex-shrink-0" size={12} />
                            <span className="break-all">{truncateUrl(item.publishTime)}</span>
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="mr-2 text-gray-400 flex-shrink-0" size={14} />
                          <span>{formatDateTime(item.publishTime)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.price ? (
                        <span className="text-sm font-semibold text-green-600">
                          ₹{item.price}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.updated_date ? (
                        <span className="text-xs text-gray-500">
                          {formatDateTime(item.updated_date)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublishScheduleForm