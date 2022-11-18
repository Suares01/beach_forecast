import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import type { NavigateFunction } from "react-router-dom";

import { useAxios } from "../axios";
import { AuthContext } from "./context";
import type { ISignInRequest, ISignUpRequest, IUser } from "./context";

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<IAuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const { publicAxios, authAxios } = useAxios();
  const queryClient = useQueryClient();

  const { isLoading, remove, refetch } = useQuery<IUser>(
    ["user:data"],
    async () => {
      const { data } = await authAxios.get("/users/me");

      return data;
    },
    {
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: (user) => {
        setUser(user);
      },
    }
  );

  const signInMutation = useMutation(async (userData: ISignInRequest) => {
    const { data } = await publicAxios.post<ITokens>("/signin", userData);

    return data;
  });

  const signUpMutation = useMutation(async (userData: ISignUpRequest) => {
    const { data } = await publicAxios.post<IUser>("/users", userData);

    return data;
  });

  const signIn = async (
    data: ISignInRequest,
    nav: NavigateFunction
  ): Promise<void> => {
    await signInMutation.mutateAsync(data, {
      onSuccess: async ({ accessToken, refreshToken }) => {
        localStorage.setItem("@beachForecast:accesstoken", accessToken);
        localStorage.setItem("@beachForecast:refreshtoken", refreshToken);

        await refetch();

        nav("/dashboard");
      },
      onError: (error) => {
        Promise.reject(error);
      },
    });
  };

  const signUp = async (data: ISignUpRequest): Promise<IUser> => {
    const user = await signUpMutation.mutateAsync(data, {
      onError: (error) => {
        Promise.reject(error);
      },
    });

    return user;
  };

  const signOut = async (): Promise<void> => {
    localStorage.removeItem("@beachForecast:accesstoken");
    localStorage.removeItem("@beachForecast:refreshtoken");
    localStorage.removeItem("@beachForecast:avatar");
    setUser(undefined);
    remove();
    await queryClient.invalidateQueries("user:data");
  };

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, user, isLoading, signed: !!user, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
