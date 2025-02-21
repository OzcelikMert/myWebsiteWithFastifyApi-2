import React from 'react';

export type IComponentButtonProps = {
  text?: string;
  type?: "submit" | "button" | "reset"
  className?: string;
  extraClassName?: string;
  disabled?: boolean;
  onClick?: () => Promise<void>;
};

const ComponentButton = React.memo((props: IComponentButtonProps) => {
  return (
    <button
      type={props.type ?? 'button'}
      className={`${(props.className) ?? 'btn btn-outline-primary px-5'} ${props.extraClassName ?? ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
});

export default ComponentButton;
