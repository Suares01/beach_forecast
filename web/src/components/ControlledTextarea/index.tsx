import { Textarea, TextareaProps } from "flowbite-react";
import React from "react";
import { Controller, Control } from "react-hook-form";

export type ControlledTextareaProps = TextareaProps & {
  control: Control<any>;
  name: string;
};

const ControlledTextarea: React.FC<ControlledTextareaProps> = ({
  name,
  control,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Textarea {...field} {...rest} helperText={error?.message} />
      )}
    />
  );
};

export default ControlledTextarea;
