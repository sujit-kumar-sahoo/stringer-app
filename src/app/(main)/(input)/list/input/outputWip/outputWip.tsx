'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const outputWipPage: React.FC = () => {
  return (
    <ActivityListing 
      status={10} 
      countKey="outputWip" 
      title="outputWip"
    />
  )
}

export default outputWipPage;