import "reflect-metadata";

import { describe, expect, it, vi, Mocked, MockInstance } from "vitest";

import { Request, type Response } from "@core/Request";
import type { ICacheService } from "@services/cacheService/ICacheService";

import { StormGlass } from "../StormGlass";

vi.mock("@core/Request", () => {
  const Request = vi.fn();
  Request.prototype.get = vi.fn();
  Request.prototype.isRequestError = vi.fn();
  return { Request };
});

describe("Storm Glass client", () => {
  const mockedRequest = new Request() as Mocked<Request>;

  const mockedCache: Mocked<ICacheService> = {
    set: vi.fn(),
    get: vi.fn() as MockInstance<[key: string], Promise<unknown>> &
      (<T = any>(key: string) => Promise<T | undefined>),
    clearAllCache: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  const lat = -22.9461;
  const lng = -43.1811;

  const normalizedClientFixture = [
    {
      swellDirection: 156.73,
      swellHeight: 0.72,
      swellPeriod: 8.36,
      time: "2022-01-11T18:00:00+00:00",
      waveDirection: 153.44,
      waveHeight: 0.72,
      windDirection: 130.65,
    },
  ];

  const stormGlassWeatherFixtures = {
    hours: [
      {
        swellDirection: {
          noaa: 156.73,
        },
        swellHeight: {
          noaa: 0.72,
        },
        swellPeriod: {
          noaa: 8.36,
        },
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: {
          noaa: 153.44,
        },
        waveHeight: {
          noaa: 0.72,
        },
        windDirection: {
          noaa: 130.65,
        },
      },
    ],
    meta: {
      cost: 1,
      dailyQuota: 10,
      end: "2022-01-11 18:00",
      lat: -22.970722,
      lng: -43.182365,
      params: [
        "swellDirection",
        "swellHeight",
        "swellPeriod",
        "waveDirection",
        "waveHeight",
        "windDirection",
        "windSpeed",
      ],
      requestCount: 3,
      source: ["noaa"],
      start: "2022-01-11 18:00",
    },
  };

  it("should return the normalized forecast from the StormGlass service", async () => {
    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeatherFixtures,
    } as Response<any>);

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(normalizedClientFixture);
  });

  it("should return normalized forecast from cache", async () => {
    mockedRequest.get.mockResolvedValue({
      data: null,
    } as Response<any>);

    mockedCache.get.mockResolvedValue(normalizedClientFixture);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(normalizedClientFixture);
  });

  it("should exclude incomplete data points", async () => {
    const incompleteResponse = {
      hours: [
        {
          waveHeight: {
            noaa: 300,
          },
          time: "2022-01-13T00:00:00+00:00",
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as Response<any>);

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    mockedRequest.get.mockRejectedValue({ message: "Network Error" });

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    mockedRequest.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
