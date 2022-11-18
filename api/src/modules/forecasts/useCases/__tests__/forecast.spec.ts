import "reflect-metadata";

import { describe, expect, it, Mocked, MockInstance, vi } from "vitest";

import { ForecastProcessingInternalError } from "@core/errors/ForecastProcessingInternalError";
import { Request } from "@core/Request";
import { IBeach } from "@modules/beaches/entities/Beach";
import { OpenMeteo } from "@modules/forecasts/clients/OpenMeteo";
import { Rating } from "@modules/forecasts/services/Rating";
import { ICacheService } from "@services/cacheService/ICacheService";

import {
  ProcessForecastsUseCase,
  ITimeForecast,
} from "../ProcessForecastsUseCase";

vi.mock("@core/Request", () => {
  const Request = vi.fn();
  Request.prototype.get = vi.fn();
  Request.prototype.isRequestError = vi.fn();
  return { Request };
});

vi.mock("@modules/forecasts/clients/OpenMeteo", () => {
  const OpenMeteo = vi.fn();
  OpenMeteo.prototype.fetchPoints = vi.fn();
  return { OpenMeteo };
});

describe("Forecast Service", () => {
  const mockedCache: Mocked<ICacheService> = {
    set: vi.fn(),
    get: vi.fn() as MockInstance<[key: string], Promise<unknown>> &
      (<T = any>(key: string) => Promise<T | undefined>),
    clearAllCache: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  const mockedRequest = new Request() as Mocked<Request>;

  const mockedOpenMeteo = new OpenMeteo(
    mockedCache,
    mockedRequest
  ) as Mocked<OpenMeteo>;

  const beaches: IBeach[] = [
    {
      id: "tes",
      lat: -22.9461,
      lng: -43.1811,
      name: "Copacabana",
      position: "E",
      userId: "fake_id",
    },
  ];

  it("should return the forecast for a list of beaches", async () => {
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

    mockedOpenMeteo.fetchPoints.mockResolvedValue(normalizedClientFixture);

    const expectedResponse = [
      {
        time: "2022-01-11T18:00:00+00:00",
        forecast: [
          {
            lat: -22.9461,
            lng: -43.1811,
            name: "Copacabana",
            position: "E",
            rating: 2,
            swellDirection: 156.73,
            swellHeight: 0.72,
            swellPeriod: 8.36,
            time: "2022-01-11T18:00:00+00:00",
            waveDirection: 153.44,
            waveHeight: 0.72,
            windDirection: 130.65,
          },
        ],
      },
    ];

    const forecast = new ProcessForecastsUseCase(mockedOpenMeteo, Rating);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it("should return an empty list when the beaches array is empty", async () => {
    const forecast = new ProcessForecastsUseCase(mockedOpenMeteo, Rating);
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it("should throw internal processing error when something goes wrong during the rating process", async () => {
    mockedOpenMeteo.fetchPoints.mockRejectedValue({
      message: "Error fetching data",
    });

    const forecast = new ProcessForecastsUseCase(mockedOpenMeteo, Rating);

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });

  it("should return the forecast for multiple beaches in the same hour with different ratings ordered by rating", async () => {
    mockedOpenMeteo.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.72,
        swellPeriod: 13.67,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 232.12,
        waveHeight: 0.72,
        windDirection: 310.65,
      },
    ]);

    mockedOpenMeteo.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 0,
        swellHeight: 2.0,
        swellPeriod: 13.67,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 270,
        waveHeight: 2.07,
        windDirection: 299.45,
      },
    ]);

    const beaches: IBeach[] = [
      {
        id: "fakeID",
        lat: -22.9461,
        lng: -43.1811,
        name: "Copacabana",
        position: "E",
        userId: "fake-id",
      },
      {
        id: "fakeID",
        lat: -22.9461,
        lng: -43.1811,
        name: "Copacabana",
        position: "N",
        userId: "fake-id",
      },
    ];

    const expectedResponse: ITimeForecast[] = [
      {
        time: "2022-01-11T18:00:00+00:00",
        forecast: [
          {
            lat: -22.9461,
            lng: -43.1811,
            name: "Copacabana",
            position: "N",
            rating: 3,
            swellDirection: 0,
            swellHeight: 2.0,
            swellPeriod: 13.67,
            time: "2022-01-11T18:00:00+00:00",
            waveDirection: 270,
            waveHeight: 2.07,
            windDirection: 299.45,
          },
          {
            lat: -22.9461,
            lng: -43.1811,
            name: "Copacabana",
            position: "E",
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.72,
            swellPeriod: 13.67,
            time: "2022-01-11T18:00:00+00:00",
            waveDirection: 232.12,
            waveHeight: 0.72,
            windDirection: 310.65,
          },
        ],
      },
    ];

    const forecast = new ProcessForecastsUseCase(mockedOpenMeteo, Rating);

    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
