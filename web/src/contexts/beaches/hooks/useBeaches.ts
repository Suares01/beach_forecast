import { useContext } from "react";

import { BeachesContext, IBeachesContext } from "../context";

export const useBeaches = (): IBeachesContext => useContext(BeachesContext);
