export interface IApiRequestParam {
  endPoint?: string;
  apiUrl: string;
  data?: object;
  processData?: boolean;
  contentType?: string | false;
  signal?: AbortSignal;
  onUploadProgress?: (e: any, percent: number) => void;
}

export type IApiRequestParamMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
