'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Clock, Trash2, Calendar } from 'lucide-react'
import { getPriceTag } from '@/services/priceTag'
import { addPublish } from '@/services/publishAt'

interface PublishScheduleItem {
  id: string;
  platform: string;
  publishTime: string;
}

interface PublishScheduleFormProps {
  onScheduleAdd?: (item: PublishScheduleItem) => void;
  className?: string;
}

interface PlatformOption {
  value: string;
  label: string;
}

const PublishScheduleForm: React.FC<PublishScheduleFormProps> = ({ 
  onScheduleAdd, 
  className = "" 
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [publishTime, setPublishTime] = useState('')
  const [publishScheduleList, setPublishScheduleList] = useState<PublishScheduleItem[]>([])
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([
    { value: '', label: 'Select Platform' }
  ])
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true)
  const [platformError, setPlatformError] = useState<string | null>(null)

  // Fetch platform options on component mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setIsLoadingPlatforms(true)
        setPlatformError(null)
        
        const priceTagData = await getPriceTag()
        
        // Debug logging
        console.log('getPriceTag response:', priceTagData)
        console.log('Is array:', Array.isArray(priceTagData))
        
        // Transform the data from getPriceTag into platform options
        const platforms: PlatformOption[] = [
          { value: '', label: 'Select Platform' }
        ]
        
        // Check if response has success and data properties
        if (priceTagData?.success && Array.isArray(priceTagData.data)) {
          const platformsFromData = priceTagData.data.map((item: any) => {
            console.log('Processing item:', item)
            return {
              value: item.type, // Using 'type' as the value (TV, ENGLISH_WEB)
              label: item.type_text // Using 'type_text' as the display label (Tv, English web)
            }
          })
          console.log('Mapped platforms:', platformsFromData)
          platforms.push(...platformsFromData)
        } else if (Array.isArray(priceTagData)) {
          // Fallback for direct array response
          const platformsFromData = priceTagData.map((item: any) => ({
            value: item.type,
            label: item.type_text
          }))
          platforms.push(...platformsFromData)
        } else {
          console.log('Unexpected data structure:', priceTagData)
        }
        
        console.log('Final platform options:', platforms)
        setPlatformOptions(platforms)
      } catch (error) {
        console.error('Error fetching platforms:', error)
        setPlatformError(`Failed to load platforms: ${error}`)
      } finally {
        setIsLoadingPlatforms(false)
      }
    }

    fetchPlatforms()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlatform || !publishTime) {
      alert('Please select a platform and enter publish time')
      return
    }

    const newItem: PublishScheduleItem = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      publishTime: publishTime
    }

    // Add to local list
    setPublishScheduleList(prev => [...prev, newItem])

    // Call parent callback if provided
    if (onScheduleAdd) {
      onScheduleAdd(newItem)
    }

    // Optionally call addPublish service
    try {
      await addPublish(newItem)
    } catch (error) {
      console.error('Error adding publish schedule:', error)
      // Handle error appropriately - maybe show a toast notification
    }

    // Reset form
    setSelectedPlatform('')
    setPublishTime('')
  }

  // Remove item from list
  const removeItem = (id: string) => {
    setPublishScheduleList(prev => prev.filter(item => item.id !== id))
  }

  // Get platform display name
  const getPlatformLabel = (value: string) => {
    const platform = platformOptions.find(option => option.value === value)
    return platform ? platform.label : value
  }

  // Format datetime for display
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
          <Calendar className="mr-2" size={20} />
          Publish Schedule ({publishScheduleList.length})
        </h2>
      </div>

      {/* Add Schedule Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                id="platform"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                disabled={isLoadingPlatforms}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

            {/* Publish Time Input */}
            <div>
              <label htmlFor="publishTime" className="block text-sm font-medium text-gray-700 mb-2">
                Publish Time
              </label>
              <input
                type="datetime-local"
                id="publishTime"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoadingPlatforms}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {publishScheduleList.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="mr-2" size={16} />
              Scheduled Publications
            </h3>
            
            <div className="space-y-2">
              {publishScheduleList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {getPlatformLabel(item.platform)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 flex items-center">
                        <Clock className="mr-1" size={14} />
                        {formatDateTime(item.publishTime)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Remove schedule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {publishScheduleList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto mb-2" size={48} />
            <p>No publish schedules added yet</p>
            <p className="text-sm">Add a schedule using the form above</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublishScheduleForm