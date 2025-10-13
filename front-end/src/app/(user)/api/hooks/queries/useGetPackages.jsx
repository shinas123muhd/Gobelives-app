"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { GET_PACKAGES } from "../endpoints"; // base URL for /api/packages

/**
 * useGetPackages Hook
 * Handles:
 * - All packages
 * - Category-wise packages
 * - Single package detail by ID
 */
const useGetPackages = ({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
  cateogry = "",
  id = "",
} = {}) => {
  return useQuery({
    queryKey: ["packages", { page, limit, sortBy, sortOrder, cateogry, id }],
    queryFn: async () => {
      let res;

      if (id) {
        // ✅ Case 3: Single package
        res = await api.get(`${GET_PACKAGES}/${id}`);
      } else {
        // ✅ Case 1 or 2: All or category-wise packages
        res = await api.get(GET_PACKAGES, {
          params: { page, limit, sortBy, sortOrder, cateogry },
        });
      }

      return res.data.data;
    },
    enabled: Boolean(id || page), // prevents running before params are set
    keepPreviousData: true,
  });
};

export default useGetPackages;
