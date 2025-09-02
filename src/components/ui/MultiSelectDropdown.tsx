import React from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface MultiSelectDropdownProps {
  label: string
  selectedItems: (string | number)[]
  options: Array<Record<string, any>>
  onToggleItem: (item: any) => void
  onSelectAll: () => void
  onClearAll: () => void
  dropdownKey: string
  openDropdown: string | null
  setOpenDropdown: (key: string | null) => void
  idKey?: string
  displayKey?: string
  isLoading?: boolean
  className?: string
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  selectedItems,
  options,
  onToggleItem,
  onSelectAll,
  onClearAll,
  dropdownKey,
  openDropdown,
  setOpenDropdown,
  idKey = 'id',
  displayKey = 'name',
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`relative dropdown-container ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey)
        }}
        className="flex items-center justify-between space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 min-w-[140px] transition-colors"
        disabled={isLoading}
      >
      <span className="truncate">
      {isLoading
        ? 'Loading...'
        : (selectedItems?.length === 0) // Add optional chaining
        ? label
        : (selectedItems?.length === 1)
        ? options.find(opt => opt[idKey] === selectedItems[0])?.[displayKey] || ''
        : `${selectedItems?.length} selected`}
    </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${
            openDropdown === dropdownKey ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {openDropdown === dropdownKey && !isLoading && (
        <div className="absolute z-30 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
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

          {options.map((option) => (
            <div
              key={option[idKey]}
              onClick={(e) => {
                e.stopPropagation()
                onToggleItem(option[idKey])
              }}
              className={`flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors ${
                selectedItems.includes(option[idKey]) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4 mr-3">
                {selectedItems.includes(option[idKey]) && (
                  <Check size={14} className="text-blue-600" />
                )}
              </div>
              <span 
                className={`flex-1 ${
                  selectedItems.includes(option[idKey]) 
                    ? 'text-blue-700 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {option[displayKey]}
              </span>
            </div>
          ))}

          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown