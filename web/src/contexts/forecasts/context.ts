import { createContext } from "react";

import { IBeach } from "../beaches/context";

interface IBeachForecast
  extends Pick<IBeach, "lat" | "lng" | "name" | "position"> {
  rating: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  time: string;
}

interface IForecast {
  time: string;
  forecast: IBeachForecast[];
}

interface IForecastsContext {
  forecasts: IForecast[];
  isLoading: boolean;
}

const ForecastsContext = createContext<IForecastsContext>(
  {} as IForecastsContext
);

export { ForecastsContext };
export type { IBeachForecast, IForecast, IForecastsContext };
