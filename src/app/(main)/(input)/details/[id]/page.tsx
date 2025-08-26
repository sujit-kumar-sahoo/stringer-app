
'use client'

import { useState, useEffect } from 'react'
import DesktopDetails from './DesktopDetails'
import MobileDetails from './MobileDetails'

// Custom hook to detect mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // You can adjust this breakpoint as needed (768px is common for tablet/mobile)
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkDevice()

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice)

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}

export default function DetailsPage() {
  const isMobile = useIsMobile()


  const DetailComponent = isMobile ? MobileDetails : DesktopDetails

  return <DetailComponent />
}