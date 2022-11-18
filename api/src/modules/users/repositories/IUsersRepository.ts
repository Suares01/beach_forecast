import { GetUserDto } from "../dtos/getUser.dto";
import { UpdatePasswordDto } from "../dtos/updatePassword.dto";
import { IUser } from "../entities/User";

export type UserInfo = Pick<
  IUser,
  "id" | "username" | "email" | "verified" | "createdAt" | "updatedAt"
>;

export type UserWithPassword = UserInfo & { password: string };

export interface IRecoveryToken {
  passwordResetToken: string;
  passwordResetExpires: Date;
}

export interface IUsersRepository {
  create(data: IUser): Promise<UserInfo>;
  findOne(data: GetUserDto): Promise<UserInfo | null>;
  findOneWithPassword(data: GetUserDto): Promise<UserWithPassword | null>;
  updateUsername(id: string, username: string): Promise<UserInfo>;
  updatePassword(
    data: Omit<UpdatePasswordDto, "currentPassword">
  ): Promise<UserInfo>;
  delete(id: string): Promise<UserInfo>;
}
