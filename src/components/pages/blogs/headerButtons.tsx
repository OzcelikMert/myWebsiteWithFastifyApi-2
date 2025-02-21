import React from 'react';
import { useAppSelector } from '@redux/hooks';
import ComponentButtonWithSearch from '@components/elements/button/withSearch';
import { selectTranslation } from '@redux/features/translationSlice';
import { IUserGetResultService } from 'types/services/user.service';
import ComponentPageBlogsAuthorSocialMedia from './authorSocialMedia';

type IComponentProps = {
  author?: IUserGetResultService;
  onSearch: (text: string) => void;
};

const ComponentPageBlogsHeaderButtons = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="align-center">
      {props.author ? (
        <ComponentPageBlogsAuthorSocialMedia item={props.author} />
      ) : undefined}
      <div className="mt-2">
        <ComponentButtonWithSearch
          placeHolder={t('search')}
          onSearch={(searchText) => props.onSearch(searchText)}
        />
      </div>
    </div>
  );
});

export default ComponentPageBlogsHeaderButtons;
