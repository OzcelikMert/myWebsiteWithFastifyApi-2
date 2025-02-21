import React from 'react';
import ComponentForm from '@components/elements/form';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentButtonWithLoading from '@components/elements/button/withLoading';

type IComponentProps = {
  submitButtonText: string;
  mutedText: string;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
};

const ComponentThemeSubscribeForm = React.memo((props: IComponentProps) => {
  return (
    <ComponentForm
      formMethods={props.form}
      enterToSubmit
      hideSubmitButton
      onSubmit={(data) => props.onSubmit(data)}
    >
      <div className="subscribe row mt-3 text-center justify-content-center">
        <div className="col-md-10">
          <ComponentFormInput
            name="email"
            type="email"
            placeholder="email@email.com"
            mutedText={props.mutedText}
            mutedTextClassName="text-light"
          />
        </div>
        <div className="col-md-8 mt-2">
          <ComponentButtonWithLoading
            type="submit"
            className="btn btn-warning"
            text={props.submitButtonText}
            isLoading={props.form.formState.isSubmitting}
          />
        </div>
      </div>
    </ComponentForm>
  );
});

export default ComponentThemeSubscribeForm;
