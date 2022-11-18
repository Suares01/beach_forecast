import { Modal } from "flowbite-react";
import React from "react";

import { IBeachForecast } from "../../contexts/forecasts/context";
import { formatDate } from "../../utils/formatDate";
import { handlePosition } from "../../utils/handlePosition";

interface IForecastModalProps {
  onClose: () => void;
  show: boolean;
  beachForecast: IBeachForecast;
}

const ForecastModal: React.FC<IForecastModalProps> = ({
  onClose,
  show,
  beachForecast: {
    name,
    lat,
    lng,
    position,
    rating,
    swellDirection,
    swellHeight,
    swellPeriod,
    time,
    waveDirection,
    waveHeight,
    windDirection,
  },
}) => {
  return (
    <Modal size="5xl" show={show} onClose={onClose}>
      <Modal.Header>{name} Forecast</Modal.Header>
      <Modal.Body className="flex flex-col justify-center sm:flex-row">
        <div className="sm:px-8 sm:border-r-2 sm:border-r-gray-200 sm:dark:border-r-gray-600">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Beach info:
          </h2>
          <ul className="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
            <li>name: {name}</li>
            <li>latitude: {lat}</li>
            <li>longitude: {lng}</li>
            <li>position: {handlePosition(position)}</li>
          </ul>
        </div>
        <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-600 sm:hidden" />
        <div className="sm:px-8 sm:border-r-2 sm:border-r-gray-200 sm:dark:border-r-gray-600">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Forecast details:
          </h2>
          <ul className="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
            <li>time: {formatDate(time)}</li>
            <li>swell direction: {swellDirection}</li>
            <li>swell height: {swellHeight}</li>
            <li>swell period: {swellPeriod}</li>
            <li>wave direction: {waveDirection}</li>
            <li>wave height: {waveHeight}</li>
            <li>wind direction: {windDirection}</li>
          </ul>
        </div>
        <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-600 sm:hidden" />
        <div className="sm:px-8">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Rating:
          </h2>
          <ul className="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
            <li>Total rating: {rating} out of 5</li>
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForecastModal;
