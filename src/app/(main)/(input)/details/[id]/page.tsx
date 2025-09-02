
'use client'

import { useState, useEffect } from 'react'
import DesktopDetails from './DesktopDetails'
import MobileDetails from './MobileDetails'


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {

      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()

    window.addEventListener('resize', checkDevice)

     return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}

export default function DetailsPage() {
  const isMobile = useIsMobile()


  const DetailComponent = isMobile ? MobileDetails : DesktopDetails

  return <DetailComponent />
}