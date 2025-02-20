import React from 'react';

type IComponentProps = {
  text?: string;
  type?: "submit" | "button" | "reset"
  className?: string;
  extraClassName?: string;
  disabled?: boolean;
  onClick?: () => Promise<void>;
};

const ComponentButton = React.memo((props: IComponentProps) => {
  return (
    <button
      type={props.type ?? 'button'}
      className={`${(props.className) ?? 'btn btn-outline-primary'} ${props.extraClassName ?? ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
});

export default ComponentButton;
