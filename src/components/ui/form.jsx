"use client";
import * as React from "react"
import { Slot } from "radix-ui"
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next";
import { Input } from ".";

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = (
  {
    ...props
  }
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItemContext = React.createContext({})

function FormItem({
  className,
  ...props
}) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props} />
  );
}

function FormControl({
  ...props
}) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props} />
  );
}

function FormDescription({
  className,
  ...props
}) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props} />
  );
}

function FormMessage({
  className,
  rules,
  ...props
}) {
  const { t } = useTranslation("validation");
  const { error, formMessageId } = useFormField()
  const body = error ? String(t(error?.message ?? "", rules ?? {})) : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      {...props}>
      {body}
    </p>
  );
}

/**
 * Composant de champ de formulaire personnalise
 */
function CustomFormField({ name, control, icon: Icon, page="register", rules, ...props }) {
  const { t } = useTranslation("auth");
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const label = t(`${page}.fields.${name}.label`);
        return (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            {Icon && (
              <Icon
                className="absolute top-1/2 left-5 -translate-1/2 text-gray-400 "
                size={16}
              />
            )}
            <FormControl>
              <Input
                {...field}
                {...props}
                placeholder={t(`${page}.fields.${name}.placeholder`)}
                className="pl-10"
              />
            </FormControl>
          </div>
          <FormMessage rules={{attribute: label,...rules}} />
        </FormItem>
  )}}
    />
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  CustomFormField,
}
