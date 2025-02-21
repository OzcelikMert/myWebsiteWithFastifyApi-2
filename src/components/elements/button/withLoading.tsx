import { useFormReducer } from '@library/react/handles/form';
import { VariableLibrary } from '@library/variable';
import React, { useState } from 'react';
import ComponentButtonLoading from './loading';
import ComponentButton, { IComponentButtonProps } from '.';

type IComponentState = {
  isLoading: boolean;
};

const initialState: IComponentState = {
  isLoading: false,
};

type IComponentProps = {
  isLoading?: boolean;
} & IComponentButtonProps;

const ComponentButtonWithLoading = React.memo((props: IComponentProps) => {
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  const onClick = async () => {
    setIsLoading(true);
    if (props.onClick) {
      await props.onClick();
    }
    setIsLoading(false);
  };

  const checkIsLoading = () => {
    return typeof props.isLoading !== 'undefined' ? props.isLoading : isLoading;
  };

  return checkIsLoading() ? (
    <ComponentButtonLoading text={props.text} className={props.className} />
  ) : (
    <ComponentButton
      text={props.text}
      className={props.className}
      extraClassName={props.extraClassName}
      onClick={() => onClick()}
    />
  );
});

export default ComponentButtonWithLoading;
