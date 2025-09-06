"use client"
import Price from './price'; 
import withAuth from '@/hoc/withAuth';
 function PricePage() {
  return <Price/>;
}
export default withAuth(PricePage)