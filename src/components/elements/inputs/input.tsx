import { omit } from 'lodash';
import React from 'react';
import { Form } from 'react-bootstrap';

export type IComponentInputProps = {
  title?: string;
  titleElement?: React.ReactNode;
  hasAnError?: boolean;
  errorText?: string;
  as?: 'textarea';
  mutedText?: string;
  mutedTextClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ComponentInput = React.memo(
  React.forwardRef<any, IComponentInputProps>((props, ref) => {
    const inputProps = omit(
      props,
      'errorText',
      'hasAnError',
      'titleElement',
      'size',
      'value',
      'mutedText',
      'mutedTextClassName'
    );

    return (
      <Form.Group className="mb-3">
        <Form.Label>
          {props.title} {props.titleElement}
        </Form.Label>
        <Form.Control ref={ref} {...inputProps} value={props.value as any} />
        {props.hasAnError ? (
          <Form.Text as="p" className="text-danger fs-6 fw-bold"><i className="mdi mdi-information me-2 fs-4"></i>{props.errorText}</Form.Text>
        ) : null}
        {props.mutedText ? (
          <Form.Text className={`${props.mutedTextClassName ?? "text-muted "}`}>{props.mutedText}</Form.Text>
        ) : null}
      </Form.Group>
    );
  })
);

export default ComponentInput;
