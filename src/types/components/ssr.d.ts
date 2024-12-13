import { IAppStore } from '@lib/store';
import { IncomingMessage } from 'http';
import { IComponentGetResultService } from 'types/services/component.service';

export type IFuncComponentServerSideProps = (
  store: IAppStore,
  req: IncomingMessage,
  component: IComponentGetResultService
) => Promise<void>;
