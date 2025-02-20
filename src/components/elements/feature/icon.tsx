import React from 'react';

type IComponentProps = {
  color?: React.CSSProperties['color'];
  icon: string;
  title: string;
  describe: string;
};

const ComponentFeatureIcon = React.memo((props: IComponentProps) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="icon">
          <span>
            <i
              style={{ ...(props.color ? { color: props.color } : {}) }}
              className={`mdi mdi-${props.icon}`}
            ></i>
          </span>
        </div>
        <h4 className="card-title">{props.title}</h4>
        <p className="card-text">{props.describe} </p>
      </div>
    </div>
  );
});

export default ComponentFeatureIcon;
