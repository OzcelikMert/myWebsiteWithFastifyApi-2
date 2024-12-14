import React, { FormEvent, useReducer, useState } from 'react';
import { IComponentGetResultService } from 'types/services/component.service';
import { VariableLibrary } from '@library/variable';
import { Form } from 'react-bootstrap';
import ComponentLoadingButton from '@components/elements/button/loadingButton';
import { MailerService } from '@services/mailer.service';
import { useFormReducer } from '@library/react/handles/form';
import { HelperUtil } from '@utils/helper.util';

type IComponentProps = {
  component: IComponentGetResultService;
};

export default function ComponentThemeContactPageForm({
  component,
}: IComponentProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, onChangeInput } = useFormReducer(initialFormState);
  let componentElementContents =
    HelperUtil.getComponentElementContents(component);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (
      VariableLibrary.isEmpty(
        formState.email,
        formState.subject,
        formState.name,
        formState.message
      ) ||
      !formState.email.match(isValidEmail)
    ) {
      return null;
    }

    dispatch({ type: 'SET_SENDING', payload: true });

    const serviceResult = await MailerService.send({
      email: formState.email,
      message: getMailMessage(),
      key: component.key,
    });

    dispatch({ type: 'SET_SENDING', payload: false });

    if (serviceResult.status) {
      dispatch({ type: 'SET_SUCCESSFUL', payload: true });
    }
  };

  const getMailMessage = () => {
    return `
            <b>Local Time: </b> ${new Date()} </br>
            <b>Name: </b> ${formState.name} </br>
            <b>Email: </b> ${formState.email} </br>
            <b>Subject: </b> ${formState.subject} </br>
            <hr>
            <b>Message: </b> </br> </br>
            ${formState.message}
        `;
  };

  const ContactFormSuccessMessage = () => {
    return (
      <div>
        <h5 className="text-success animate__animated animate__fadeInUp">
          {componentElementContents('successMessage')?.content}
        </h5>
      </div>
    );
  };

  const ContactForm = () => {
    return (
      <div>
        <Form onSubmit={(event) => onSubmit(event)}>
          <Form.Group className="mb-3">
            <Form.Label>
              {componentElementContents('fullName')?.content}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={componentElementContents('fullNameInput')?.content}
              name="formData.name"
              value={formState.name}
              onChange={(e) => onChangeInput(e)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              {componentElementContents('email')?.content}
            </Form.Label>
            <Form.Control
              type="email"
              placeholder={componentElementContents('emailInput')?.content}
              name="formData.email"
              value={formState.email}
              onChange={(e) => onChangeInput(e)}
              required
            />
            <Form.Text className="text-muted">
              {componentElementContents('emailShortContent')?.content}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              {componentElementContents('subject')?.content}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={componentElementContents('subjectInput')?.content}
              name="formData.subject"
              value={formState.subject}
              onChange={(e) => onChangeInput(e)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              {componentElementContents('message')?.content}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder={componentElementContents('messageInput')?.content}
              name="formData.message"
              value={formState.message}
              onChange={(e) => onChangeInput(e)}
              required
            />
          </Form.Group>
          <ComponentLoadingButton
            text={componentElementContents('submitButtonText')?.content}
            className="btn btn-primary"
            type="submit"
            isLoading={state.isSending}
          />
        </Form>
      </div>
    );
  };

  return (
    <section className="contact-form-section">
      <div className="container">
        {state.isSuccessful ? ContactFormSuccessMessage() : ContactForm()}
      </div>
    </section>
  );
}

type IComponentState = {
  isSending: boolean;
  isSuccessful: boolean;
};

const initialState: IComponentState = {
  isSending: false,
  isSuccessful: false,
};

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

type IAction =
  | { type: 'SET_SENDING'; payload: boolean }
  | { type: 'SET_SUCCESSFUL'; payload: boolean };

function reducer(state: IComponentState, action: IAction): IComponentState {
  switch (action.type) {
    case 'SET_SENDING':
      if (state.isSending == action.payload) return state;
      return { ...state, isSending: action.payload };
    case 'SET_SUCCESSFUL':
      if (state.isSuccessful == action.payload) return state;
      return { ...state, isSuccessful: action.payload };
    default:
      return state;
  }
}
