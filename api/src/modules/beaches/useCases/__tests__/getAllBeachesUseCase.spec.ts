import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { describe, vi, it, expect } from "vitest";

import type { CreateBeachDto } from "@modules/beaches/dtos/createBeach.dto";
import { Beach } from "@modules/beaches/entities/Beach";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";

import { GetAllBeachesUseCase } from "../GetAllBeachesUseCase";

describe("GetAllBeachesUseCase", () => {
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
    findAll: vi.fn().mockResolvedValue([defaultBeach]),
  };

  const getAllBeachesUseCase = new GetAllBeachesUseCase(
    mockedBeachesRepository as IBeachesRepository
  );

  it("should return a user beach list", async () => {
    const beaches = await getAllBeachesUseCase.execute({
      userId: defaultBeach.userId,
    });

    expect(beaches).toEqual([defaultBeach]);
  });
});
