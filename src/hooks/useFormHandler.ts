import { FormikHelpers, FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

type UseFormHandlerParams<T extends FormikValues> = {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<Yup.AnyObject>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void> | void;
  onSuccess?: (result?: any) => void;
  onError?: (error: any) => void;
};

export const useFormHandler = <T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  onError,
}: UseFormHandlerParams<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: T, formikHelpers: FormikHelpers<T>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const result = await onSubmit(values, formikHelpers);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred while submitting the form';
      
      setSubmitError(errorMessage);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const resetFormWithValues = (values: Partial<T> = {}) => {
    formik.resetForm({ values: { ...initialValues, ...values } as T });
    setSubmitError(null);
  };

  const handleFieldChange = (field: string, value: any, shouldValidate = true) => {
    formik.setFieldValue(field, value, shouldValidate);
  };

  const handleFieldBlur = (field: string) => {
    formik.setFieldTouched(field, true, true);
  };

  const getFieldError = (field: string): string | undefined => {
    return formik.touched[field as keyof T] && formik.errors[field as keyof T]
      ? String(formik.errors[field as keyof T])
      : undefined;
  };

  const hasErrors = Object.keys(formik.errors).length > 0;
  const isFormValid = formik.isValid && formik.dirty && !isSubmitting;

  return {
    ...formik,
    isSubmitting,
    submitError,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    resetForm: resetFormWithValues,
    hasErrors,
    isFormValid,
  };
};
