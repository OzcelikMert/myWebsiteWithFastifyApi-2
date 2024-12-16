import React, { Component, useState } from 'react';

type IComponentState = {
  isLoading: boolean;
};

type IComponentProps = {
  text?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  isLoading?: boolean;
};

export default function ComponentLoadingButton({
  className,
  isLoading,
  onClick,
  text,
  type,
}: IComponentProps) {
  const [isLoadingState, setIsLoadingState] =
    useState<IComponentState['isLoading']>(false);

  const _onClick = async () => {
    if (typeof isLoading != 'undefined' && isLoading) return false;
    else if (isLoadingState) return false;

    setIsLoadingState(true);
    if (onClick) {
      await onClick();
    }
    setIsLoadingState(false);
  };

  const _isLoading =
    typeof isLoading != 'undefined' ? isLoading : isLoadingState;
  return (
    <button
      type={type ?? 'button'}
      className={`${className ?? 'btn btn-outline-primary btn-lg'}`}
      onClick={(event) => _onClick()}
      disabled={_isLoading}
    >
      <span>{text}</span>
      {_isLoading ? <i className="fa fa-spinner fa-spin ms-1"></i> : null}
    </button>
  );
}
