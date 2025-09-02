"use client"
import DashboardStringer from '@/app/(main)/dashboard/stringer/DashboardStringer'; 
import withAuth from '@/hoc/withAuth';
 function Dashboardstringer() {
  return <DashboardStringer/>;
}
export default withAuth(Dashboardstringer)