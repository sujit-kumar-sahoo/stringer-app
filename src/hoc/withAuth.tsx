'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      // Only redirect when loading is complete and user is not authenticated
      if (!loading && !isAuthenticated) {
        // Try multiple redirect methods for better compatibility
        router.replace('/login');
        
        // Fallback: Force navigation if router.replace doesn't work
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 100);
      }
    }, [isAuthenticated, loading, router]);

    // Show nothing while loading to prevent flash
    if (loading) {
      return null;
    }

    // Block rendering if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    // Only render the component if user is authenticated
    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Wrapper;
};

export default withAuth;