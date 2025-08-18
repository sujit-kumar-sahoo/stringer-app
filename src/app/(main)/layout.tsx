// src/app/(main)/layout.tsx
import { SidebarProvider } from '../../context/SidebarContext';
import { Header } from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import MainContent from '../../components/layout/MainContent';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
}