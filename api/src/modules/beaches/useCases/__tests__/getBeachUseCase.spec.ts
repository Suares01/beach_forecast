import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { describe, vi, it, expect } from "vitest";

import type { CreateBeachDto } from "@modules/beaches/dtos/createBeach.dto";
import { Beach } from "@modules/beaches/entities/Beach";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";

import { GetBeachUseCase } from "../GetBeachUseCase";

describe("GetBeachUseCase", () => {
  const createBeachDto: CreateBeachDto = {
    lat: -22.969778,
    lng: -43.186859,
    name: "Copacabana",
    position: "S",
    userId: randomUUID(),
  };
  const defaultBeach = new Beach(createBeachDto);

  const mockedBeachesRepository: Partial<IBeachesRepository> = {
    findByName: vi.fn().mockResolvedValue(defaultBeach),
    findById: vi.fn().mockResolvedValue(defaultBeach),
  };

  const getBeachUseCase = new GetBeachUseCase(
    mockedBeachesRepository as IBeachesRepository
  );

  it("should successfully return a beach by id", async () => {
    const beach = await getBeachUseCase.execute({
      userId: defaultBeach.userId,
      id: defaultBeach.id,
    });

    expect(beach).toEqual(defaultBeach);
    expect(mockedBeachesRepository.findById).toHaveBeenCalled();
    expect(mockedBeachesRepository.findByName).not.toHaveBeenCalled();
  });

  it("should successfully return a beach by name", async () => {
    const beach = await getBeachUseCase.execute({
      userId: defaultBeach.userId,
      name: defaultBeach.name,
    });

    expect(beach).toEqual(defaultBeach);
    expect(mockedBeachesRepository.findById).not.toHaveBeenCalled();
    expect(mockedBeachesRepository.findByName).toHaveBeenCalled();
  });

  it("should throw an error if the beach does not exist", async () => {
    vi.spyOn(mockedBeachesRepository, "findByName").mockResolvedValue(null);

    const beach = getBeachUseCase.execute({
      userId: defaultBeach.userId,
      name: defaultBeach.name,
    });

    await expect(beach).rejects.toThrow();
  });
});
