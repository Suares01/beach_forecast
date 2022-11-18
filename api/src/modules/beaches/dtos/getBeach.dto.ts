import { IBeach } from "../entities/Beach";

export type GetBeachDto = Partial<Pick<IBeach, "id" | "name">> & {
  userId: string;
};
