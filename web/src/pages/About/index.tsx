import React from "react";

const About: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-center my-4">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Beach Forecast Project
      </h1>
      <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        Always updating and showing you the best beach to go to right now!
      </p>
      <p className="my-2 font-light text-gray-500 dark:text-gray-400 max-w-3xl">
        Beach Forecast is a NON-PROFIT project made by a programming student. It
        is completely free and therefore has some limitations. Each user can
        register a limited number of beaches, in addition to having a limit of
        daily requests they can make.
      </p>
      <p className="my-2 font-light text-gray-500 dark:text-gray-400 max-w-3xl">
        The objective is to bring the forecasts of the beaches that you
        register, using an algorithm that analyzes the forecasts and evaluates
        (on a note from 0 to 5) whether the beach is good or not for surfing at
        a certain time of day.
      </p>
      <p className="mt-2 font-light text-gray-500 dark:text-gray-400 max-w-3xl">
        The project uses the{" "}
        <a
          href="https://open-meteo.com/"
          target="blank"
          className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
        >
          Open-Meteo API
        </a>{" "}
        to get the forecasts. This one is free and open source for
        non-commercial use with data offered under{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          target="blank"
          className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
        >
          Attribution-NonCommercial 4.0 International (CC BYNC 4.0)
        </a>
        , they do not restrict access, however they ask for fair use.
      </p>
    </section>
  );
};

export default About;
