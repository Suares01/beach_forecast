import { Rating, Spinner, Timeline } from "flowbite-react";
import { RatingStarProps } from "flowbite-react/lib/esm/components/Rating/RatingStar";
import React, { useState } from "react";

import Container from "../../components/Container";
import { useForecasts } from "../../contexts/forecasts";
import { IBeachForecast } from "../../contexts/forecasts/context";
import { formatDate } from "../../utils/formatDate";
import ForecastModal from "./ForecastModal";

const Dashboard: React.FC = () => {
  const [modal, setModal] = useState<IBeachForecast | null>(null);
  const { forecasts, isLoading } = useForecasts();

  const onClose = () => setModal(null);
  const openModal = (beachForecast: IBeachForecast) => setModal(beachForecast);

  const formatRatingStars = (rate: number) => {
    const stars: React.FC<RatingStarProps>[] = new Array(5).fill(Rating.Star);

    return stars.map((Star, index) => {
      if (index + 1 <= rate) {
        return <Star key={index} filled />;
      } else {
        return <Star key={index} filled={false} />;
      }
    });
  };

  return (
    <>
      <Container>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spinner aria-label="Loading forecasts" />
            <span className="mx-1 text-base text-gray-900 dark:text-white">
              Loading forecasts...
            </span>
          </div>
        ) : (
          <Timeline className="mx-10">
            {forecasts.map((forecast) => (
              <Timeline.Item key={forecast.time}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{formatDate(forecast.time)}</Timeline.Time>
                  <Timeline.Title>
                    Forecast for {formatDate(forecast.time)}
                  </Timeline.Title>
                  {forecast.forecast.map((beachForecast) => (
                    <div
                      key={beachForecast.name}
                      className="block p-6 my-1 max-w-sm cursor-pointer bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      onClick={() => openModal(beachForecast)}
                    >
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {beachForecast.name}
                      </h5>
                      <Rating>
                        {formatRatingStars(beachForecast.rating)}
                        <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {beachForecast.rating} out of 5
                        </p>
                      </Rating>
                    </div>
                  ))}
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Container>
      {modal && (
        <ForecastModal show={!!modal} onClose={onClose} beachForecast={modal} />
      )}
    </>
  );
};

export default Dashboard;
