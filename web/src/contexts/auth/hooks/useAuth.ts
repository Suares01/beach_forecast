import { useContext } from "react";

import { AuthContext } from "../context";
import type { IAuthContext } from "../context";

export const useAuth = (): IAuthContext => useContext(AuthContext);
