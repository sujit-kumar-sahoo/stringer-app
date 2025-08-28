'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const InputToStringerpage: React.FC = () => {
  return (
    <ActivityListing 
      status={7} 
      countKey="draft" 
      title="draft"
    />
  )
}

export default InputToStringerpage;