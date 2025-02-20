import { useFormReducer } from '@library/react/handles/form';
import { VariableLibrary } from '@library/variable';
import React, { useState } from 'react';
import ComponentButtonLoading from './loading';
import ComponentButton from '.';

type IComponentState = {
  isLoading: boolean;
};

const initialState: IComponentState = {
  isLoading: false,
};

type IComponentProps = {
  text?: string;
  className?: string;
  extraClassName?: string;
  onClick?: () => Promise<void>;
};

const ComponentButtonWithLoading = React.memo((props: IComponentProps) => {
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  const onClick = async () => {
    setIsLoading(true);
    if (props.onClick) {
      await props.onClick();
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <ComponentButtonLoading text={props.text} className={props.className} />
  ) : (
    <ComponentButton
      text={props.text}
      className={props.className}
      disabled={isLoading}
      extraClassName={props.extraClassName}
      onClick={() => onClick()}
    />
  );
});

export default ComponentButtonWithLoading;
