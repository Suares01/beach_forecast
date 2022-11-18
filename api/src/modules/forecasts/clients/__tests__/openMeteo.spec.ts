import "reflect-metadata";
import { describe, expect, it, Mocked, MockInstance, vi } from "vitest";

import { ClientRequestError } from "@core/errors/ClientRequestError";
import { OpenMeteoRequestError } from "@core/errors/OpenMeteoRequestError";
import { Request } from "@core/Request";
import { ICacheService } from "@services/cacheService/ICacheService";

import { OpenMeteo } from "../OpenMeteo";

vi.mock("@core/Request", () => {
  const Request = vi.fn();
  Request.prototype.get = vi.fn();
  Request.prototype.isRequestError = vi.fn();
  return { Request };
});

describe("OpenMeteo Client", () => {
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

  const openMeteo = new OpenMeteo(mockedCache, mockedRequest);

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

  const openMeteoResponseFixtures = {
    latitude: -23.25,
    longitude: -43.75,
    generationtime_ms: 0.392913818359375,
    utc_offset_seconds: 0,
    timezone: "GMT",
    timezone_abbreviation: "GMT",
    hourly_units: {
      time: "iso8601",
      wave_height: "m",
      wave_direction: "°",
      wind_wave_direction: "°",
      swell_wave_height: "m",
      swell_wave_direction: "°",
      swell_wave_period: "s",
    },
    hourly: {
      time: ["2022-01-11T18:00:00+00:00"],
      wave_height: [0.72],
      wave_direction: [153.44],
      wind_wave_direction: [130.65],
      swell_wave_height: [0.72],
      swell_wave_direction: [156.73],
      swell_wave_period: [8.36],
    },
  };

  it("should return the normalized forecast from the OpenMeteo service", async () => {
    mockedRequest.get.mockResolvedValue({
      data: openMeteoResponseFixtures,
    });

    mockedCache.get.mockResolvedValue(undefined);

    const response = await openMeteo.fetchPoints(lat, lng);

    expect(response).toEqual(normalizedClientFixture);
  });

  it("should return normalized forecast from cache", async () => {
    mockedRequest.get.mockResolvedValue({
      data: null,
    });

    mockedCache.get.mockResolvedValue(normalizedClientFixture);

    const response = await openMeteo.fetchPoints(lat, lng);

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
    });

    mockedCache.get.mockResolvedValue(undefined);

    const response = await openMeteo.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it("should get a generic error from OpenMeteo service when the request fail before reaching the service", async () => {
    mockedRequest.get.mockRejectedValue({ message: "Network Error" });
    mockedCache.get.mockResolvedValue(undefined);

    const forecastPoints = openMeteo.fetchPoints(lat, lng);

    await expect(forecastPoints).rejects.toThrow();
    await expect(forecastPoints).rejects.toBeInstanceOf(ClientRequestError);
  });

  it("should get an OpenMeteoRequestError when the OpenMeteo service responds with error", async () => {
    mockedRequest.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      error: true,
    });
    mockedCache.get.mockResolvedValue(undefined);

    const forecastPoints = openMeteo.fetchPoints(lat, lng);

    await expect(forecastPoints).rejects.toThrow();
    await expect(forecastPoints).rejects.toBeInstanceOf(OpenMeteoRequestError);
  });
});
