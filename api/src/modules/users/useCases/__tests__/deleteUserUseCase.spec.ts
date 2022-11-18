import "reflect-metadata";

import { describe, it, vi, expect } from "vitest";

import { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IHash } from "@services/hash/IHash";

import { DeleteUserUseCase } from "../DeleteUserUseCase";

describe("DeleteUserUseCase", () => {
  const createUserDto: CreateUserDto = {
    username: "john_doe",
    email: "doe@mail.com",
    password: "123456Doe",
  };
  const { id, createdAt, email, password, updatedAt, username, verified } =
    new User(createUserDto);
  const defaultUser = {
    id,
    createdAt,
    email,
    password,
    updatedAt,
    username,
    verified,
  };

  const mockedUsersRepository: Partial<IUsersRepository> = {
    findOneWithPassword: vi.fn().mockResolvedValue(defaultUser),
    delete: vi.fn().mockResolvedValue({ ...defaultUser, password: undefined }),
  };
  const mockedHashService: Partial<IHash> = {
    compare: vi.fn().mockResolvedValue(true),
  };
  const mockedBeachesRepository: Partial<IBeachesRepository> = {
    deleteMany: vi.fn().mockResolvedValue(1),
  };

  const deleteUserUseCase = new DeleteUserUseCase(
    mockedUsersRepository as IUsersRepository,
    mockedHashService as IHash,
    mockedBeachesRepository as IBeachesRepository
  );

  it("should delete the user", async () => {
    const { id, password } = defaultUser;

    await deleteUserUseCase.execute({ id, password });

    expect(mockedBeachesRepository.deleteMany).toHaveBeenCalled();
    expect(mockedUsersRepository.delete).toHaveBeenCalled();
  });

  it("should throw an error if the user does not exist", async () => {
    vi.spyOn(mockedUsersRepository, "findOneWithPassword").mockResolvedValue(
      null
    );

    const deletedUser = deleteUserUseCase.execute({
      id: defaultUser.id,
      password: defaultUser.password,
    });

    await expect(deletedUser).rejects.toThrow();
    expect(mockedHashService.compare).not.toHaveBeenCalled();
    expect(mockedBeachesRepository.deleteMany).not.toHaveBeenCalled();
    expect(mockedUsersRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw an error if the password is incorrect", async () => {
    vi.spyOn(mockedHashService, "compare").mockResolvedValue(false);

    const deletedUser = deleteUserUseCase.execute({
      id: defaultUser.id,
      password: defaultUser.password,
    });

    await expect(deletedUser).rejects.toThrow();
    expect(mockedBeachesRepository.deleteMany).not.toHaveBeenCalled();
    expect(mockedUsersRepository.delete).not.toHaveBeenCalled();
  });
});
