import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

import type { CreateBeachDto } from "@modules/beaches/dtos/createBeach.dto";
import { Beach } from "@modules/beaches/entities/Beach";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";

import { DeleteBeachUseCase } from "../DeleteBeachUseCase";

describe("DeleteBeachUseCase", () => {
  const createBeachDto: CreateBeachDto = {
    lat: -22.969778,
    lng: -43.186859,
    name: "Copacabana",
    position: "S",
    userId: randomUUID(),
  };
  const defaultBeach = new Beach(createBeachDto);

  const mockedBeachesRepository: Partial<IBeachesRepository> = {
    findById: vi.fn().mockResolvedValue(defaultBeach),
    delete: vi.fn().mockResolvedValue(defaultBeach),
  };

  const deleteBeachUseCase = new DeleteBeachUseCase(
    mockedBeachesRepository as IBeachesRepository
  );

  it("should return the deleted beach", async () => {
    const deletedBeach = await deleteBeachUseCase.execute({
      id: defaultBeach.id,
    });

    expect(deletedBeach).toEqual(defaultBeach);
    expect(mockedBeachesRepository.delete).toHaveBeenCalled();
  });

  it("should return the deleted beach", async () => {
    vi.spyOn(mockedBeachesRepository, "findById").mockResolvedValueOnce(null);

    const deletedBeach = deleteBeachUseCase.execute({
      id: defaultBeach.id,
    });

    await expect(deletedBeach).rejects.toThrow();
    expect(mockedBeachesRepository.delete).not.toHaveBeenCalled();
  });
});
