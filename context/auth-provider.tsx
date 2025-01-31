"use client";

import useAuth from "@/hooks/use-auth";
import { User } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user?: User;
  setUser: (user: User | undefined) => void;
  sessionId?: string;
  setSessionId: (sessionId: string | undefined) => void;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();
  const [user, setUser] = useState<User | undefined>(data?.data?.user);
  const [sessionId, setSessionId] = useState<string | undefined>(
    data?.data?.sessionId,
  );

  useEffect(() => {
    if (data?.data?.user) {
      setUser(data.data.user);
      setSessionId(data.data.sessionId);
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        sessionId,
        user,
        error,
        isLoading,
        isFetching,
        refetch,
        setUser,
        setSessionId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const conext = useContext(AuthContext);
  if (!conext) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return conext;
};
