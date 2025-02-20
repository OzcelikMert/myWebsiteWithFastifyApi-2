import React from 'react';

type IComponentProps = {
  text?: string;
  className?: string;
};

const ComponentButtonLoading = React.memo((props: IComponentProps) => {
  return (
    <button
      className={`${props.className} btn btn-outline-primary`}
      disabled={true}
      type={'button'}
    >
      <i className="fa fa-spinner fa-spin me-1"></i>
      {props.text}
    </button>
  );
});

export default ComponentButtonLoading;
