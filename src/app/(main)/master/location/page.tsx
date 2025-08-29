"use client"
import Location from './location'; 
import withAuth from '@/hoc/withAuth';
 function locationPage() {
  return <Location/>;
}
export default withAuth(locationPage)