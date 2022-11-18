import { GetUserDto } from "@modules/users/dtos/getUser.dto";
import { UpdatePasswordDto } from "@modules/users/dtos/updatePassword.dto";
import { IUser } from "@modules/users/entities/User";

import { prisma } from "../../../../database/prisma";
import {
  UserInfo,
  IUsersRepository,
  UserWithPassword,
} from "../IUsersRepository";

export class PrismaUsersRepository implements IUsersRepository {
  private model = prisma.user;

  private userInfo = {
    id: true,
    verified: true,
    username: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };

  public create(data: IUser): Promise<UserInfo> {
    return this.model.create({
      data,
      select: this.userInfo,
    });
  }

  public findOne({
    email,
    id,
    username,
  }: GetUserDto): Promise<UserInfo | null> {
    return this.model.findUnique({
      where: {
        email,
        id,
        username,
      },
      select: this.userInfo,
    });
  }

  public findOneWithPassword({
    email,
    id,
    username,
  }: GetUserDto): Promise<UserWithPassword | null> {
    return this.model.findUnique({
      where: {
        id,
        email,
        username,
      },
      select: {
        ...this.userInfo,
        password: true,
      },
    });
  }

  public updateUsername(id: string, username: string): Promise<UserInfo> {
    return this.model.update({
      data: {
        username,
      },
      where: {
        id,
      },
      select: this.userInfo,
    });
  }

  public updatePassword({
    id,
    newPassword,
  }: Omit<UpdatePasswordDto, "currentPassword">): Promise<UserInfo> {
    return this.model.update({
      data: {
        password: newPassword,
      },
      where: {
        id,
      },
      select: this.userInfo,
    });
  }

  public delete(id: string): Promise<UserInfo> {
    return this.model.delete({
      where: {
        id,
      },
      select: this.userInfo,
    });
  }
}
