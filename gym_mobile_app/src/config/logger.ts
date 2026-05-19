export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

type LogArgs = unknown[];

export interface Logger {
  readonly level: LogLevel;
  child(scope: string): Logger;
  debug(...args: LogArgs): void;
  error(...args: LogArgs): void;
  info(...args: LogArgs): void;
  setLevel(level: LogLevel): void;
  warn(...args: LogArgs): void;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50,
};

const LOG_LEVELS = Object.keys(LOG_LEVEL_PRIORITY) as LogLevel[];

const isLogLevel = (value: string): value is LogLevel =>
  LOG_LEVELS.includes(value.toLowerCase() as LogLevel);

const getInitialLogLevel = (): LogLevel => {
  const configuredLevel = process.env.EXPO_PUBLIC_LOG_LEVEL;

  if (configuredLevel && isLogLevel(configuredLevel)) {
    return configuredLevel.toLowerCase() as LogLevel;
  }

  return process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
};

let activeLogLevel = getInitialLogLevel();

const shouldLog = (level: LogLevel) =>
  LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[activeLogLevel] && activeLogLevel !== 'silent';

const withScope = (scope: string | undefined, args: LogArgs) =>
  scope ? [`[${scope}]`, ...args] : args;

const writeLog = (level: Exclude<LogLevel, 'silent'>, scope: string | undefined, args: LogArgs) => {
  if (!shouldLog(level)) {
    return;
  }

  console[level](...withScope(scope, args));
};

const createLogger = (scope?: string): Logger => ({
  get level() {
    return activeLogLevel;
  },

  child(childScope: string) {
    return createLogger(scope ? `${scope}:${childScope}` : childScope);
  },

  debug(...args: LogArgs) {
    writeLog('debug', scope, args);
  },

  error(...args: LogArgs) {
    writeLog('error', scope, args);
  },

  info(...args: LogArgs) {
    writeLog('info', scope, args);
  },

  setLevel(level: LogLevel) {
    activeLogLevel = level;
  },

  warn(...args: LogArgs) {
    writeLog('warn', scope, args);
  },
});

export const logger = createLogger();
