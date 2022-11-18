import { AxiosInstance } from "axios";
import { createContext } from "react";

interface IAxiosContext {
  publicAxios: AxiosInstance;
  authAxios: AxiosInstance;
}

const AxiosContext = createContext<IAxiosContext>({} as IAxiosContext);

export { AxiosContext };
export type { IAxiosContext };
