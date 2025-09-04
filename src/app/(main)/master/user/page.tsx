"use client"
import User from './user'; 
import withAuth from '@/hoc/withAuth';
 function Userpage() {
  return <User/>;
}
export default withAuth(Userpage)