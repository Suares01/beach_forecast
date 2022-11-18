import { useContext } from "react";

import { ForecastsContext, IForecastsContext } from "../context";

export const useForecasts = (): IForecastsContext =>
  useContext(ForecastsContext);
