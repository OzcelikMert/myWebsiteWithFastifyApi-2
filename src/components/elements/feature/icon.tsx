import React from 'react';

type IComponentProps = {
  color?: React.CSSProperties['color'];
  icon: string;
  title: string;
  describe: string;
};

export default function ComponentFeatureIcon({
  describe,
  icon,
  title,
  color,
}: IComponentProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="icon">
          <span>
            <i
              style={{ color: color }}
              className={`mdi mdi-${icon}`}
            ></i>
          </span>
        </div>
        <h4 className="card-title">
          {title}
        </h4>
        <p className="card-text">
          {describe}{' '}
        </p>
      </div>
    </div>
  );
}
