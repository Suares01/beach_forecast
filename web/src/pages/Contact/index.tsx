import { Button, Label } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInput from "../../components/ControlledInput";
import ControlledTextarea from "../../components/ControlledTextarea";

interface IFormFields {
  email: string;
  subject: string;
  message: string;
}

const validationSchema: yup.SchemaOf<IFormFields> = yup.object({
  email: yup
    .string()
    .email("Insira um email válido")
    .required("Insira um email"),
  subject: yup.string().required("Defina um assunto do email"),
  message: yup.string().required("Defina a mensagem do email"),
});

const Contact: React.FC = () => {
  const { control, handleSubmit } = useForm<IFormFields>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      message: "",
      subject: "",
    },
  });

  const handleContact = (data: IFormFields) => {
    console.log(data);
  };

  return (
    <section>
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature?
          Need details about our Business plan? Let us know.
        </p>
        <form
          onSubmit={handleSubmit(handleContact)}
          className="space-y-8"
          noValidate
        >
          <div>
            <Label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your email
            </Label>
            <ControlledInput
              type="email"
              name="email"
              control={control}
              id="email"
              placeholder="your@mail.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <ControlledInput
              type="text"
              name="subject"
              control={control}
              id="subject"
              placeholder="Let us know how we can help you"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="message">Your message</Label>
            <ControlledTextarea
              id="message"
              name="message"
              control={control}
              rows={6}
              placeholder="Leave a comment..."
              required
            />
          </div>
          <Button type="submit">Send message</Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
