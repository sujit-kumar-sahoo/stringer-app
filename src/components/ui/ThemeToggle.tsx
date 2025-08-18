'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-indigo-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200" />
        )}
      </div>
    </button>
  )
}