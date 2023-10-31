export * from './region';
export * from './customer';

export type ExcuteResult = {
  code?: string;
  errorMessage?: string;
  result?: any | string;
};
