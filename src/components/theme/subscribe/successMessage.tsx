import React from 'react';

type IComponentProps = {
  text: string;
};

const ComponentThemeSubscribeSuccessMessage = React.memo(
  (props: IComponentProps) => {
    return (
      <div className="subscribe-success mt-3">
        <h5 className="animate__animated animate__fadeInUp">{props.text}</h5>
      </div>
    );
  }
);

export default ComponentThemeSubscribeSuccessMessage;
