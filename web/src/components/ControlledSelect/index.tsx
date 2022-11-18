import { Select, SelectProps } from "flowbite-react";
import React, { ReactNode } from "react";
import { Controller, Control } from "react-hook-form";

export type ControlledSelectProps = SelectProps & {
  control: Control<any>;
  name: string;
  options: ReactNode[];
};

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  name,
  control,
  options,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select {...field} {...rest} helperText={error?.message}>
          {options}
        </Select>
      )}
    />
  );
};

export default ControlledSelect;
