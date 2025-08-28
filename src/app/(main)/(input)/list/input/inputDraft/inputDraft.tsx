'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const Draftpage: React.FC = () => {
  return (
    <ActivityListing 
      status={1} 
      countKey="draft" 
      title="draft"
    />
  )
}

export default Draftpage;