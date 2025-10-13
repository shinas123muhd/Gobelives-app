"use client"
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios"; // your centralized axios instance
import { GET_BLOGS } from "../endpoints";

const useGetBlogs = (page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc") => {
  return useQuery({
    queryKey: ["gallery", page, limit, sortBy, sortOrder], // cache key
    queryFn: async () => {
      const res = await api.get(GET_BLOGS, {
        params: { page, limit, sortBy, sortOrder },
      });
      return res.data.data; // Return only data
    },
    keepPreviousData: true, // keeps old data while fetching next page
  });
};

export default useGetBlogs;