import { useAuth as useAuthContext} from "@/context/AuthContext";

const useAuth = () => {
  const { user, loading, isAuthenticated, login, logout } = useAuthContext();

  return { user, loading, isAuthenticated, login, logout };
};

export default useAuth;
