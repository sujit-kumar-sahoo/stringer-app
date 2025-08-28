'use client'
import ActivityListing from '@/components/inputComponent/ActivityListing'; 

const PublishPage: React.FC = () => {
  return (
    <ActivityListing 
      status={5} 
      countKey="published" 
      title="published"
    />
  )
}

export default PublishPage;