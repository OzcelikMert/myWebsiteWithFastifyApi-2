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
      'mutedText'
    );

    return (
      <Form.Group className="mb-3">
        <Form.Label>
          {props.title} {props.titleElement}
        </Form.Label>
        <Form.Control ref={ref} {...inputProps} value={props.value as any} />
        {props.mutedText ? (
          <Form.Text className="text-muted">{props.mutedText}</Form.Text>
        ) : null}
        {props.hasAnError ? (
          <Form.Text className="text-danger">{props.errorText}</Form.Text>
        ) : null}
      </Form.Group>
    );
  })
);

export default ComponentInput;
