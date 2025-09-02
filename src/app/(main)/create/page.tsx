
'use client'

import { useState, useEffect } from 'react'
import DesktopCreate from './DesktopCreate'
import MobileCreate from './MobileCreate'


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

export default function CreatePage() {
  const isMobile = useIsMobile()


  const DetailComponent = isMobile ? MobileCreate : DesktopCreate

  return <DetailComponent />
}