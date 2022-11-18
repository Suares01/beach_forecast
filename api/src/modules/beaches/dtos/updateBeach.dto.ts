import { CreateBeachDto } from "./createBeach.dto";

export type UpdateBeachDto = Partial<Omit<CreateBeachDto, "userId">>;
