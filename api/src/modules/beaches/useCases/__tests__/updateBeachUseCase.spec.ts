import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { describe, it, vi, expect } from "vitest";

import type { CreateBeachDto } from "@modules/beaches/dtos/createBeach.dto";
import type { UpdateBeachDto } from "@modules/beaches/dtos/updateBeach.dto";
import { Beach, type IBeach } from "@modules/beaches/entities/Beach";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";

import { UpdateBeachUseCase } from "../UpdateBeachUseCase";

describe("UpdateBeachUseCase", () => {
  const createBeachDto: CreateBeachDto = {
    lat: -22.969778,
    lng: -43.186859,
    name: "Copacabana",
    position: "S",
    userId: randomUUID(),
  };
  const { createdAt, id, lat, lng, name, position, updatedAt, userId } =
    new Beach(createBeachDto);
  const defaultBeach = {
    createdAt,
    id,
    lat,
    lng,
    name,
    position,
    updatedAt,
    userId,
  };

  const updateBeachDto: UpdateBeachDto = {
    lat: -23.015987008563762,
    lng: -43.41211522059619,
    name: "Praia da Reserva",
    position: "S",
  };
  const updatedBeach: IBeach = {
    ...defaultBeach,
    ...updateBeachDto,
  };

  const mockedBeachesRepository: Partial<IBeachesRepository> = {
    findById: vi.fn().mockResolvedValue(defaultBeach),
    update: vi.fn().mockResolvedValue(updatedBeach),
  };

  const updateBeachUseCase = new UpdateBeachUseCase(
    mockedBeachesRepository as IBeachesRepository
  );

  it("should return a successfully updated beach", async () => {
    const beach = await updateBeachUseCase.execute({
      ...updateBeachDto,
      beachId: defaultBeach.id,
    });

    expect(beach).toEqual(updatedBeach);
    expect(mockedBeachesRepository.update).toHaveBeenCalled();
  });

  it("should throw an error if the beach does not exist", async () => {
    vi.spyOn(mockedBeachesRepository, "findById").mockResolvedValueOnce(null);

    const beach = updateBeachUseCase.execute({
      ...updateBeachDto,
      beachId: defaultBeach.id,
    });

    await expect(beach).rejects.toThrow();
    expect(mockedBeachesRepository.update).not.toHaveBeenCalled();
  });
});
