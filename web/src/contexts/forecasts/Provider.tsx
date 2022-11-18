import React, { useState } from "react";
import { useQuery } from "react-query";

import { useAxios } from "../axios";
import { ForecastsContext, IForecast } from "./context";

export interface IForecastsContextProviderProps {
  children: React.ReactNode;
}

const ForecastsContextProvider: React.FC<IForecastsContextProviderProps> = ({
  children,
}) => {
  const [forecasts, setForecasts] = useState<IForecast[]>([]);

  const { authAxios } = useAxios();
  const { isLoading, isFetching } = useQuery<IForecast[]>(
    ["user:forecasts"],
    async () => {
      const { data } = await authAxios.get("/forecasts");

      return data;
    },
    {
      retry: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: (forecasts) => {
        setForecasts(forecasts);
      },
    }
  );

  return (
    <ForecastsContext.Provider
      value={{ isLoading: isLoading || isFetching, forecasts }}
    >
      {children}
    </ForecastsContext.Provider>
  );
};

export default ForecastsContextProvider;
