import { IAppStore } from '@redux/store';
import { IncomingMessage } from 'http';
import { IComponentGetResultService } from 'types/services/component.service';

export type IFuncComponentServerSideProps = (
  store: IAppStore,
  req: IncomingMessage,
  component: IComponentGetResultService
) => Promise<void>;

export interface IComponentWithServerSideProps<T = any> extends React.FC<T> {
  componentServerSideProps?: IFuncComponentServerSideProps;
}
