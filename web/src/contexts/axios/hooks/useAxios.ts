import { useContext } from "react";

import { AxiosContext, IAxiosContext } from "../context";

export const useAxios = (): IAxiosContext => useContext(AxiosContext);
