import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import beachImage1 from "../../assets/beach1.jpg";
import beachImage2 from "../../assets/beach2.jpg";
import beachImage3 from "../../assets/beach3.jpg";
import beachImage4 from "../../assets/beach4.jpg";
import beachImage5 from "../../assets/beach5.jpg";
import beachImage6 from "../../assets/beach6.jpg";
import beachImage7 from "../../assets/beach7.jpg";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="font text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Beach Forecast
            </h1>
            <p className="mt-4 text-xl text-gray-400">
              Veja as previsões e saiba qual a melhor praia no momento!
            </p>
          </div>
          <div>
            <div className="mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img
                          src={beachImage1}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src={beachImage2}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src={beachImage3}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src={beachImage4}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src={beachImage5}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src={beachImage6}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src={beachImage7}
                          alt="Beach Image"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => navigate("/signup")}>Sign up</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
