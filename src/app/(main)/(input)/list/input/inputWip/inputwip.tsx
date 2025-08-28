'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const WipPage: React.FC = () => {
  return (
    <ActivityListing 
      status={9} 
      countKey="inputWip" 
      title="Wait List"
    />
  )
}

export default WipPage;