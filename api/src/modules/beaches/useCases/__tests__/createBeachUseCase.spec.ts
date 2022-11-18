import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { describe, vi, it, expect } from "vitest";

import type { CreateBeachDto } from "@modules/beaches/dtos/createBeach.dto";
import { Beach } from "@modules/beaches/entities/Beach";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { CreateBeachUseCase } from "../CreateBeachUseCase";

describe("CreateBeachUseCase", () => {
  const createBeachDto: CreateBeachDto = {
    lat: -22.969778,
    lng: -43.186859,
    name: "Copacabana",
    position: "S",
    userId: randomUUID(),
  };
  const defaultBeach = new Beach(createBeachDto);

  const createUserDto: CreateUserDto = {
    username: "john_doe",
    email: "doe@mail.com",
    password: "123456Doe",
  };
  const defaultUser = new User(createUserDto);

  const mockedBeachesRepository: Partial<IBeachesRepository> = {
    create: vi.fn().mockResolvedValue(defaultBeach),
    findByLatLng: vi.fn().mockResolvedValue(null),
    findByName: vi.fn().mockResolvedValue(null),
  };
  const mockedUsersRepository: Partial<IUsersRepository> = {
    findOne: vi.fn().mockResolvedValue(defaultUser),
  };

  const createBeachUseCase = new CreateBeachUseCase(
    mockedBeachesRepository as IBeachesRepository,
    mockedUsersRepository as IUsersRepository
  );

  it("should return a beach with success", async () => {
    const beach = await createBeachUseCase.execute(createBeachDto);

    expect(beach).toEqual(defaultBeach);
    expect(mockedBeachesRepository.create).toHaveBeenCalled();
  });

  it("should throw an error if the user does not exist", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(null);

    const beach = createBeachUseCase.execute(createBeachDto);

    await expect(beach).rejects.toThrow();
    expect(mockedBeachesRepository.findByName).not.toHaveBeenCalled();
  });

  it("should throw an error if the user already has a registered beach with the same name", async () => {
    vi.spyOn(mockedBeachesRepository, "findByName").mockResolvedValueOnce(
      defaultBeach
    );

    const beach = createBeachUseCase.execute(createBeachDto);

    await expect(beach).rejects.toThrow();
    expect(mockedBeachesRepository.findByLatLng).not.toHaveBeenCalled();
  });

  it("should throw an error if the user already has a registered beach with the same lat and lng", async () => {
    vi.spyOn(mockedBeachesRepository, "findByLatLng").mockResolvedValueOnce(
      defaultBeach
    );

    const beach = createBeachUseCase.execute(createBeachDto);

    await expect(beach).rejects.toThrow();
    expect(mockedBeachesRepository.create).not.toHaveBeenCalled();
  });
});
