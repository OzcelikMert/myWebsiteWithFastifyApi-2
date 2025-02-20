import { useFormReducer } from '@library/react/handles/form';
import { VariableLibrary } from '@library/variable';
import React, { useState } from 'react';

type IComponentState = {
  status: boolean;
  text: string;
};

const initialState: IComponentState = {
  status: false,
  text: '',
};

type IComponentProps = {
  placeHolder?: string;
  onSearch?: (searchText: string) => void;
};

const ComponentButtonWithSearch = React.memo((props: IComponentProps) => {
  const [status, setStatus] = useState(initialState.status);

  const [text, setText] = useState(initialState.text);

  const onSearch = () => {
    if (props.onSearch) {
      if (!VariableLibrary.isEmpty(text)) {
        props.onSearch(text);
      }
    }
  };

  const onToggle = () => {
    if (!status) {
      setText('');
    }
    setStatus((state) => !state);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-button-main">
      <div className={`search-wrapper ${status ? 'active' : ''}`}>
        <div className="input-holder">
          <input
            name="search"
            type="text"
            className="search-input"
            placeholder={props.placeHolder ?? ''}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
          />
          <button
            type="button"
            className="search-icon"
            onClick={() => (status ? onSearch() : onToggle())}
          >
            <span></span>
          </button>
        </div>
        <span className={`close`} onClick={() => onToggle()}></span>
      </div>
    </div>
  );
});

export default ComponentButtonWithSearch;
