"use client"
import Tag from './tag'; 
import withAuth from '@/hoc/withAuth';
 function Tagpage() {
  return <Tag/>;
}
export default withAuth(Tagpage)