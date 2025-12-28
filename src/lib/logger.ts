import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  browser: {
    asObject: true,
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
});

// Client-side logger with namespace support
export function createLogger(namespace: string) {
  return logger.child({ namespace });
}

// Pre-configured loggers for different parts of the app
export const gameLogger = createLogger('game');
export const partyLogger = createLogger('party');
export const uiLogger = createLogger('ui');
