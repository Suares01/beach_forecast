import { Button, Label } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInput from "../../components/ControlledInput";
import ControlledSelect from "../../components/ControlledSelect";
import { useBeaches } from "../../contexts/beaches";

interface IFormFields {
  name: string;
  lat: number;
  lng: number;
  position: "S" | "W" | "N" | "E";
}

const validationSchema: yup.SchemaOf<IFormFields> = yup.object({
  name: yup.string().required("Defina o nome da praia"),
  lat: yup.number().not([0], "Defina a latitude").required("Defina a latitude"),
  lng: yup
    .number()
    .not([0], "Defina a longitude")
    .required("Defina a longitude"),
  position: yup
    .string()
    .equals(["S", "W", "N", "E"], "Posição não aceita")
    .required("Defina a posição da praia"),
});

const RegisterBeachForm: React.FC = () => {
  const { registerBeach } = useBeaches();

  const { control, handleSubmit, resetField } = useForm<IFormFields>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      lat: 0,
      lng: 0,
      name: "",
      position: "N",
    },
  });

  const handleRegisterBeach = async (data: IFormFields) => {
    await registerBeach(data);
    resetField("lat");
    resetField("lng");
    resetField("name");
    resetField("position");
  };

  const selectOptions = [
    <option key="N" value="N">
      North
    </option>,
    <option key="S" value="S">
      South
    </option>,
    <option key="E" value="E">
      East
    </option>,
    <option key="W" value="W">
      West
    </option>,
  ];

  return (
    <section className="my-8 shadow">
      <div className="md:grid md:grid-cols-3 md:gap-6 border-gray-200 bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 rounded">
        <header className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Register Beach
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Fill in the data and register a beach. If in doubt{" "}
              <Link to="#" className="text-blue-600 dark:text-blue-500">
                click here
              </Link>
              .
            </p>
          </div>
        </header>
        <form
          className="mt-5 md:col-span-2 md:mt-0"
          onSubmit={handleSubmit(handleRegisterBeach)}
        >
          <div className="overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <Label htmlFor="lat" className="block text-sm font-medium">
                    Latitude
                  </Label>
                  <ControlledInput
                    type="number"
                    control={control}
                    name="lat"
                    autoComplete="123456"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <Label htmlFor="lng" className="block text-sm font-medium">
                    Longitude
                  </Label>
                  <ControlledInput
                    type="number"
                    control={control}
                    name="lng"
                    autoComplete="123456"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <Label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </Label>
                  <ControlledInput
                    type="text"
                    control={control}
                    name="name"
                    autoComplete="given-name"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <Label
                    htmlFor="position"
                    className="block text-sm font-medium"
                  >
                    Position
                  </Label>
                  <ControlledSelect
                    name="position"
                    control={control}
                    autoComplete="given-position"
                    options={selectOptions}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 text-right sm:px-6">
              <Button type="submit" className="inline-flex justify-center">
                Register
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterBeachForm;
