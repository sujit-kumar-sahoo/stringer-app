'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const OutputToInputpage: React.FC = () => {
  return (
    <ActivityListing 
      status={8} 
      countKey="outputToInput" 
      title="outputToInput"
    />
  )
}

export default OutputToInputpage;