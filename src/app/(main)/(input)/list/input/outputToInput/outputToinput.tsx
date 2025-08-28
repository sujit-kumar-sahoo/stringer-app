'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const OutputToInputpage: React.FC = () => {
  return (
    <ActivityListing 
      status={11} 
      countKey="draft" 
      title="draft"
    />
  )
}

export default OutputToInputpage;