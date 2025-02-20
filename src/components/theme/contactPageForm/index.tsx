import React, { FormEvent, useReducer, useState } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { VariableLibrary } from '@library/variable';
import { Form } from 'react-bootstrap';
import { MailerService } from '@services/mailer.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelperUtil } from '@utils/helper.util';
import { IComponentWithServerSideProps } from 'types/components/ssr';
import { IActionWithPayload } from 'types/hooks';
import { useForm } from 'react-hook-form';
import { MailerSchema } from 'schemas/mailer.schema';
import ComponentForm from '@components/elements/form';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/inputs/input';

type IComponentState = {
  isSending: boolean;
  isSuccessful: boolean;
};

const initialState: IComponentState = {
  isSending: false,
  isSuccessful: false,
};

enum ActionTypes {
  SET_SENDING,
  SET_SUCCESSFUL,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_SENDING, boolean>
  | IActionWithPayload<ActionTypes.SET_SUCCESSFUL, boolean>;

function reducer(state: IComponentState, action: IAction): IComponentState {
  switch (action.type) {
    case ActionTypes.SET_SENDING:
      if (state.isSending == action.payload) return state;
      return { ...state, isSending: action.payload };
    case ActionTypes.SET_SUCCESSFUL:
      if (state.isSuccessful == action.payload) return state;
      return { ...state, isSuccessful: action.payload };
    default:
      return state;
  }
}

type IComponentFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: IComponentFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

type IComponentProps = {
  component: IComponentGetResultService;
};

const ComponentThemeContactPageForm: IComponentWithServerSideProps<IComponentProps> =
  React.memo((props) => {
    const abortControllerRef = React.useRef(new AbortController());

    const [state, dispatch] = useReducer(reducer, initialState);

    const form = useForm<IComponentFormState>({
      defaultValues: initialFormState,
      resolver: zodResolver(MailerSchema.post),
    });

    const componentElementContents = HelperUtil.getComponentElementContents(
      props.component
    );

    const getMailMessage = () => {
      const formValues = form.getValues();

      return `
            <b>Local Time: </b> ${new Date()} </br>
            <b>Name: </b> ${formValues.name} </br>
            <b>Email: </b> ${formValues.email} </br>
            <b>Subject: </b> ${formValues.subject} </br>
            <hr>
            <b>Message: </b> </br> </br>
            ${formValues.message}
        `;
    };

    const onSubmit = async (data: IComponentFormState) => {
      const params = data;

      const serviceResult = await MailerService.send({
        email: params.email,
        message: getMailMessage(),
        key: props.component.key,
      });

      if (serviceResult.status) {
        dispatch({ type: ActionTypes.SET_SUCCESSFUL, payload: true });
      }
    };

    return (
      <section className="contact-form-section">
        <div className="container">
          {state.isSuccessful ? (
            <div>
              <h5 className="text-success animate__animated animate__fadeInUp">
                {componentElementContents('successMessage')?.content}
              </h5>
            </div>
          ) : (
            <div>
              <ComponentForm
                formMethods={form}
                onSubmit={(data) => onSubmit(data)}
                i18={{
                  submitButtonText:
                    componentElementContents('submitButtonText')?.content,
                }}
              >
                <ComponentFormInput
                  name="name"
                  type="text"
                  title={componentElementContents('fullNameInput')?.content}
                  placeholder={
                    componentElementContents('fullNameInput')?.content
                  }
                />
                <ComponentFormInput
                  name="email"
                  type="email"
                  title={componentElementContents('email')?.content}
                  placeholder={componentElementContents('emailInput')?.content}
                  mutedText={
                    componentElementContents('emailShortContent')?.content
                  }
                />
                <ComponentFormInput
                  name="subject"
                  type="text"
                  title={componentElementContents('subject')?.content}
                  placeholder={
                    componentElementContents('subjectInput')?.content
                  }
                />
                <ComponentFormInput
                  name="messageInput"
                  as="textarea"
                  title={componentElementContents('message')?.content}
                  placeholder={
                    componentElementContents('messageInput')?.content
                  }
                />
              </ComponentForm>
            </div>
          )}
        </div>
      </section>
    );
  });
