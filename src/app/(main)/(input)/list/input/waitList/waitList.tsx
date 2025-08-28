'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const WaitListpage: React.FC = () => {
  return (
    <ActivityListing 
      status={2} 
      countKey="waitList" 
      title="Wait List"
    />
  )
}

export default WaitListpage;