import { useFormReducer } from '@library/react/handles/form';
import { VariableLibrary } from '@library/variable';
import React, { useState } from 'react';

type IComponentState = {
  searchStatus: boolean;
  formData: {
    search: string;
  };
};

type IComponentFormState = {
  search: string;
};

const initialFormState: IComponentFormState = {
  search: '',
};

type IComponentProps = {
  placeHolder?: string;
  onSearch?: (searchText: string) => void;
};

export default function ComponentSearchButton({
  placeHolder,
  onSearch,
}: IComponentProps) {
  const [searchStatus, setSearchStatus] =
    useState<IComponentState['searchStatus']>(false);

  const { formState, setFormState, onChangeInput } =
    useFormReducer<IComponentFormState>(initialFormState);

  const _onSearch = () => {
    if (onSearch) {
      if (!VariableLibrary.isEmpty(formState.search)) {
        onSearch(formState.search);
      }
    }
  };

  const onSearchToggle = () => {
    if (!searchStatus) {
      setFormState({ search: '' });
    }
    setSearchStatus((state) => !state);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      _onSearch();
    }
  };

  return (
    <div className="search-button-main">
      <div className={`search-wrapper ${searchStatus ? 'active' : ''}`}>
        <div className="input-holder">
          <input
            name="search"
            type="text"
            className="search-input"
            placeholder={placeHolder ?? ''}
            value={formState.search}
            onChange={(e) => onChangeInput(e)}
            onKeyDown={(e) => onKeyDown(e)}
          />
          <button
            type="button"
            className="search-icon"
            onClick={() => (searchStatus ? _onSearch() : onSearchToggle())}
          >
            <span></span>
          </button>
        </div>
        <span className={`close`} onClick={() => onSearchToggle()}></span>
      </div>
    </div>
  );
}
