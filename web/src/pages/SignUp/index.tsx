import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import logo from "../../assets/logo.png";
import ControlledInput from "../../components/ControlledInput";
import { useAuth } from "../../contexts/auth";
import { useSigned } from "../../hooks/useSigned";

interface IFormFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema: yup.SchemaOf<IFormFields> = yup.object({
  username: yup.string().required("Informe seu nome de usuario"),
  email: yup
    .string()
    .email("Insira um email válido")
    .required("Insira o email"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 dígitos")
    .max(20, "A senha deve ter no máximo 20 dígitos")
    .matches(
      /(?=.*?[a-z])/,
      "A senha deve conter pelo menos uma letra minúscula"
    )
    .matches(
      /(?=.*?[A-Z])/,
      "A senha deve conter pelo menos uma letra maiúscula"
    )
    .required("Insira a senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas não conferem")
    .required("Confirme a senha"),
});

const SignUp: React.FC = () => {
  useSigned();

  const { signUp, signIn } = useAuth();

  const { control, handleSubmit, setError } = useForm<IFormFields>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const handleSignUp = async ({ username, email, password }: IFormFields) => {
    try {
      await signUp({ email, username, password });
      await signIn({ email, password }, navigate);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data.code as number;

        switch (errorCode) {
          case 409:
            setError("email", { type: "value", message: "Email já existe" });
        }
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-4">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          Flowbite
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <form
              onSubmit={handleSubmit(handleSignUp)}
              className="space-y-4 md:space-y-6"
              noValidate
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <ControlledInput
                  control={control}
                  type="username"
                  name="username"
                  id="username"
                  placeholder="my_username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <ControlledInput
                  control={control}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@mail.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <ControlledInput
                  control={control}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <ControlledInput
                  control={control}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <Link
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      to="#"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
