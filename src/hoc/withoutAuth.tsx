"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const withoutAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!loading && isAuthenticated) {
        router.replace('/dashboard');
      }
    }, [isAuthenticated, loading, router]);

   
    if (isAuthenticated) {
      return null;
    }

   
    if (loading) {
      return null;
    }

    
    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withoutAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Wrapper;
};

export default withoutAuth;