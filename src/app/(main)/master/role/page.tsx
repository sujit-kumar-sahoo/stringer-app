"use client"
import Role from './role'; 
import withAuth from '@/hoc/withAuth';
 function RolePage() {
  return <Role/>;
}
export default withAuth(RolePage)