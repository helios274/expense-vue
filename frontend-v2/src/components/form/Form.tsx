// components/form/Form.tsx
import React from "react";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";

type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<T>; // Generic type to ensure compatibility
  onSubmit: (data: T) => void; // Accepts the typed data
};

const Form = <T extends FieldValues>({
  children,
  methods,
  onSubmit,
}: FormProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default Form;
