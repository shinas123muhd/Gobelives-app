import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuth as useAuthContext } from "../contexts/AuthContext";

// Query keys for React Query
export const authKeys = {
  all: ["auth"],
  profile: () => [...authKeys.all, "profile"],
  verify: () => [...authKeys.all, "verify"],
};

// Hook to get user profile
export const useProfile = () => {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    enabled: isAuthenticated, // Only run if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Hook to verify token
export const useVerifyToken = () => {
  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: authService.verifyToken,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setUser } = useAuthContext();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.success) {
        console.log(data.data.user);
        // Store auth data
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("userData", JSON.stringify(data.data.user));

        // Update context
        setUser(data.user);
        setIsAuthenticated(true);

        // Invalidate and refetch profile
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setUser } = useAuthContext();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      // Update context
      setUser(null);
      setIsAuthenticated(false);

      // Clear all queries
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
    },
  });
};

// Hook for token refresh
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      if (data.success) {
        // Update token
        localStorage.setItem("authToken", data.token);

        // Update user data if provided
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
          setUser(data.user);
        }

        // Invalidate profile to refetch with new token
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
    onError: (error) => {
      console.error("Token refresh error:", error);
      // If refresh fails, logout user
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
      queryClient.clear();
    },
  });
};
