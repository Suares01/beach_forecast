import { Alert, Button, Label, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInput from "../../components/ControlledInput";
import { useAxios } from "../../contexts/axios";

interface IFormData {
  email: string;
}

const validationSchema: yup.SchemaOf<IFormData> = yup.object({
  email: yup
    .string()
    .email("Forneça um email válido")
    .required("Forneça um email"),
});

const ForgotPassword: React.FC = () => {
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const { publicAxios } = useAxios();

  const { handleSubmit, control, setValue } = useForm<IFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordMutation = useMutation(
    async (email: string) => {
      await publicAxios.post("/forgotpassword", { email });
    },
    {
      onSuccess: () => {
        setSuccessAlert(true);
        setValue("email", "");
      },
    }
  );

  const handleResetPassword = async ({ email }: IFormData) => {
    await resetPasswordMutation.mutateAsync(email);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 relative">
      {successAlert && (
        <Alert
          className="absolute top-2 right-2"
          color="success"
          onDismiss={() => setSuccessAlert(false)}
        >
          <span>
            <span className="font-semibold">Email enviado!</span> Confira a sua
            caixa de entrada
          </span>
        </Alert>
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot your password?
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Don&apos;t fret! Just type in your email and we will send you a code
            to reset your password!
          </p>
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit(handleResetPassword)}
            noValidate
          >
            <div>
              <Label htmlFor="email">Your email</Label>
              <ControlledInput
                control={control}
                type="email"
                name="email"
                id="email"
                placeholder="your@mail.com"
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
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            {resetPasswordMutation.isLoading ? (
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

export default ForgotPassword;
