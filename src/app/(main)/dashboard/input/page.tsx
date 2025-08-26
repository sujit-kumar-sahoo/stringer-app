"use client"
import DashboardInput from '@/app/(main)/dashboard/input/DashboardInput'; 
import withAuth from '@/hoc/withAuth';
 function DashBoardPage() {
  return <DashboardInput/>;
}
export default withAuth(DashBoardPage)