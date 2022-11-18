import { createContext } from "react";
import { NavigateFunction } from "react-router-dom";

interface ISignUpRequest {
  username: string;
  email: string;
  password: string;
}

type ISignInRequest = Omit<ISignUpRequest, "username">;

interface IUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface IAuthContext {
  user: IUser | undefined;
  isLoading: boolean;
  signed: boolean;
  signOut: () => Promise<void>;
  signIn: (data: ISignInRequest, nav: NavigateFunction) => Promise<void>;
  signUp: (data: ISignUpRequest) => Promise<IUser>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export { AuthContext };
export type { IAuthContext, IUser, ISignUpRequest, ISignInRequest };
