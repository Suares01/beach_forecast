import { Alert, Button, Label, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInput from "../../components/ControlledInput";
import { useAxios } from "../../contexts/axios";

interface IFormData {
  password: string;
  confirmPassword: string;
}

interface IMutationParams {
  newPassword: string;
  token: string;
  email: string;
}

const validationSchema: yup.SchemaOf<IFormData> = yup.object({
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

const ResetPassword: React.FC = () => {
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const { publicAxios } = useAxios();

  const { handleSubmit, control, setValue } = useForm<IFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });

  const changePasswordMutation = useMutation(
    async ({ newPassword, email, token }: IMutationParams) => {
      await publicAxios.post("/resetpassword", {
        newPassword,
        token,
        email,
      });
    },
    {
      onSuccess: () => {
        setSuccessAlert(true);
        setValue("password", "");
        setValue("confirmPassword", "");
      },
    }
  );

  const handleChangePassword = async ({ password }: IFormData) => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      await changePasswordMutation.mutateAsync({
        newPassword: password,
        email,
        token,
      });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      {successAlert && (
        <Alert
          className="absolute top-2 right-2"
          color="success"
          onDismiss={() => setSuccessAlert(false)}
        >
          <span>
            <span className="font-semibold">Senha alterada com sucesso!</span>{" "}
            Volte para a{" "}
            <Link to="/signin" className="underline">
              página de login
            </Link>
            .
          </span>
        </Alert>
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </Link>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change Password
          </h2>
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit(handleChangePassword)}
            noValidate
          >
            <div>
              <Label htmlFor="password">New Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm password</Label>
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
                  id="newsletter"
                  aria-describedby="newsletter"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="newsletter"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            {changePasswordMutation.isLoading ? (
              <Button disabled>
                <div className="mr-3">
                  <Spinner size="sm" light={true} />
                </div>
                Processando...
              </Button>
            ) : (
              <Button type="submit">Reset password</Button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
