'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const outputToStringerPage: React.FC = () => {
  return (
    <ActivityListing 
      status={11} 
      countKey="outputToStringer" 
      title="outputToStringer"
    />
  )
}

export default outputToStringerPage;