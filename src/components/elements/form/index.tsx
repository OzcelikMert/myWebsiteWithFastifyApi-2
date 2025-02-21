import {
  FieldError,
  FieldErrors,
  FormProvider,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { Form } from 'react-bootstrap';
import ComponentButtonLoading from '../button/loading';
import ComponentButton from '../button';

export type IFormFieldError = {
  title?: string;
} & FieldError;

type IComponentPropsI18 = {
  submitButtonSubmittingText?: string;
  submitButtonText?: string;
};

type IComponentProps = {
  children: React.ReactNode;
  formMethods: UseFormReturn<any>;
  hideSubmitButton?: boolean;
  submitButtonDivClassName?: string;
  submitButtonClassName?: string;
  submitButtonExtraClassName?: string;
  enterToSubmit?: true;
  i18?: IComponentPropsI18;
  onSubmit?: (data: any) => Promise<void> | void;
};

const ComponentForm = React.memo((props: IComponentProps) => {
  const hasError =
    props.formMethods.formState.submitCount > 0 &&
    !props.formMethods.formState.isValid;

  useEffectAfterDidMount(() => {}, [props.formMethods.formState.errors]);

  const onError = (errors: FieldErrors) => {
    console.error(errors);
  };

  return (
    <FormProvider {...props.formMethods}>
      <Form
        onKeyDown={(event) => {
          if (!props.enterToSubmit && event.key === 'Enter')
            event.preventDefault();
        }}
        onSubmit={
          props.onSubmit &&
          props.formMethods.handleSubmit(props.onSubmit as any, onError)
        }
      >
        {props.children}
        <div className={props.submitButtonDivClassName ?? ''}>
          {props.hideSubmitButton ? null : props.formMethods.formState
              .isSubmitting ? (
            <ComponentButtonLoading
              text={
                props.i18?.submitButtonSubmittingText ??
                props.i18?.submitButtonText ??
                ''
              }
              className={`${props.submitButtonClassName} ${props.submitButtonExtraClassName}`}
            />
          ) : (
            <ComponentButton
              type="submit"
              text={props.i18?.submitButtonText ?? ''}
              className={props.submitButtonClassName}
              extraClassName={props.submitButtonExtraClassName}
              disabled={props.formMethods.formState.isSubmitting}
            />
          )}
        </div>
      </Form>
    </FormProvider>
  );
});

export default ComponentForm;
