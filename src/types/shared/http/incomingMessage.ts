import { ICookies } from '@redux/features/appSlice';

declare module 'http' {
  interface IncomingMessage {
    cookies: Partial<ICookies>;
  }
}
