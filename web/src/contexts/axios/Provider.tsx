import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import React from "react";

import { AxiosContext } from "./context";

export interface IAxiosContextProviderProps {
  children: React.ReactNode;
}

const AxiosContextProvider: React.FC<IAxiosContextProviderProps> = ({
  children,
}) => {
  const baseURL: string = import.meta.env.VITE_API_URL;

  const authAxios = axios.create({
    baseURL,
  });

  const publicAxios = axios.create({
    baseURL,
  });

  authAxios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("@beachForecast:accesstoken");

      if (!config.headers) config.headers = {};

      if (!config.headers.Authorization)
        config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = (failedRequest: any) => {
    const refreshToken = localStorage.getItem("@beachForecast:refreshtoken");

    const headers = {
      Authorization: `Bearer ${refreshToken}`,
    };

    const options = {
      method: "GET",
      headers,
      url: `${baseURL}/refreshToken`,
    };

    return axios(options)
      .then(async (tokenRefreshResponse) => {
        const accessToken = tokenRefreshResponse.data.accessToken;

        failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

        localStorage.setItem("@beachForecast:accesstoken", accessToken);

        return Promise.resolve();
      })
      .catch(() => {
        localStorage.removeItem("@beachForecast:accesstoken");
        localStorage.removeItem("@beachForecast:refreshtoken");
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic);

  return (
    <AxiosContext.Provider value={{ authAxios, publicAxios }}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosContextProvider;
