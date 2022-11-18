import { createContext } from "react";

interface IBeach {
  id: string;
  name: string;
  lat: number;
  lng: number;
  position: "S" | "W" | "N" | "E";
  userId: string;
}

type RegisterBeachProps = Pick<IBeach, "lat" | "lng" | "name" | "position">;

type UpdateBeachProps = RegisterBeachProps & { id: string };

interface IBeachesContext {
  beaches: IBeach[];
  isLoading: boolean;
  registerBeach: (data: RegisterBeachProps) => Promise<void>;
  updateBeach: (data: UpdateBeachProps) => Promise<void>;
  deleteBeach: (id: string) => Promise<void>;
}

const BeachesContext = createContext<IBeachesContext>({} as IBeachesContext);

export { BeachesContext };
export type { IBeach, IBeachesContext, RegisterBeachProps, UpdateBeachProps };
