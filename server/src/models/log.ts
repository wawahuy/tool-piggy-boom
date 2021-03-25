export enum ELogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error'
}

export interface LogItem {
  name: string;
  message: string;
  level: ELogLevel;
  type: string;
  timestamp: string;
}

export function getClassLogLevel(type: ELogLevel | undefined) {
  switch (type) {
    case ELogLevel.info: return 'info';
    case ELogLevel.error: return 'danger';
    case ELogLevel.warn: return 'warning';
  }
}