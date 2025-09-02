
'use client'

import { useState, useEffect } from 'react'
import DesktopActivity from './DesktopActivity'
import MobileActivity from './MobileActivity'


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

export default function ActivityPage() {
  const isMobile = useIsMobile()


  const DetailComponent = isMobile ? MobileActivity : DesktopActivity

  return <DetailComponent />
}