"use client";

import { getUserSessionQueryFn } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const useAuth = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isAuthRoute = pathname?.startsWith("/auth");

  useEffect(() => {
    if (isAuthRoute) {
      queryClient.removeQueries({ queryKey: ["authUser"] });
    }
  }, [isAuthRoute, queryClient]);

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getUserSessionQueryFn,
    staleTime: Infinity,
    enabled: !isAuthRoute,
  });
  return query;
};

export default useAuth;
