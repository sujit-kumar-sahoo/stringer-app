import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const withoutAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!loading && isAuthenticated) {
        router.push('/dashboard');
      }
    }, [isAuthenticated, loading, router]);

    if (loading || isAuthenticated) {
      // Optionally render a loading spinner or placeholder
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withoutAuth;
