import { TextInput, TextInputProps } from "flowbite-react";
import React from "react";
import { Controller, Control } from "react-hook-form";

export type ControlledInputProps = TextInputProps & {
  control: Control<any>;
  name: string;
};

const ControlledInput: React.FC<ControlledInputProps> = ({
  name,
  control,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextInput {...field} {...rest} helperText={error?.message} />
      )}
    />
  );
};

export default ControlledInput;
