import crypto from "node:crypto";
import { describe, it, expect } from "vitest";

import type { CreateBeachDto } from "../../dtos/createBeach.dto";
import { Beach, IBeach } from "../Beach";

describe("Beach Entity", () => {
  it("should create a Beach", () => {
    const createBeachDto: CreateBeachDto = {
      lat: -22.969778,
      lng: -43.186859,
      name: "Copacabana",
      position: "S",
      userId: crypto.randomUUID(),
    };

    const beach = new Beach(createBeachDto);

    expect(beach.id).toEqual(expect.any(String));
    expect(beach.lat).toBe(createBeachDto.lat);
    expect(beach.lng).toBe(createBeachDto.lng);
    expect(beach.name).toBe(createBeachDto.name);
    expect(beach.position).toBe<IBeach["position"]>("S");
    expect(beach.userId).toEqual(expect.any(String));
    expect(beach.createdAt).toEqual(expect.any(Date));
    expect(beach.updatedAt).toEqual(expect.any(Date));
  });
});
