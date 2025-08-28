'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const WaitingInOutputpage: React.FC = () => {
  return (
    <ActivityListing 
      status={3} 
      countKey="draft" 
      title="draft"
    />
  )
}

export default WaitingInOutputpage;