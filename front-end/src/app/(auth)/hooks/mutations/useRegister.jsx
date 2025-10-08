import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { REGISTER_USER } from "../endpoints";

const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (payload) => {
      // delegates to centralized auth service
      const res = await api.post( REGISTER_USER, payload);
      return res;
    },
  });
};

export default useRegister;