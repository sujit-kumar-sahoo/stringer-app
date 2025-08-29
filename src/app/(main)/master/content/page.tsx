"use client"
import Content from './contentType'; 
import withAuth from '@/hoc/withAuth';
 function Contentpage() {
  return <Content/>;
}
export default withAuth(Contentpage)