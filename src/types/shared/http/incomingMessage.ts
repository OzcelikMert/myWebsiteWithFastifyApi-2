import { ICookies } from '@lib/features/appSlice';

declare module 'http' {
  interface IncomingMessage {
    cookies: Partial<ICookies>;
  }
}
