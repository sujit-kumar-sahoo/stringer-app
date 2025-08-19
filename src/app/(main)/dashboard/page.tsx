"use client"
import DashBoard from '../../../components/dashboardComponent/DashBoard'; 
import withAuth from '@/hoc/withAuth';
 function DashBoardPage() {
  return <DashBoard/>;
}
export default withAuth(DashBoardPage)