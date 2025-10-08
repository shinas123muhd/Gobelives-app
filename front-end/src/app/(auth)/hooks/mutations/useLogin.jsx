import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { LOGIN_USER } from "../endpoints";

const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload) => {
      // delegates to centralized auth service
      const res = await api.post(LOGIN_USER, payload);
      return res;
    },
  });
};

export default useLogin;