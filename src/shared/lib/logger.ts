type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const defaultLevel: LogLevel = import.meta.env.DEV ? 'debug' : 'warn';

class Logger {
  constructor(private readonly level: LogLevel = defaultLevel) {}

  private shouldLog(nextLevel: LogLevel) {
    return levelOrder[nextLevel] >= levelOrder[this.level];
  }

  debug(message: string, meta?: unknown) {
    if (this.shouldLog('debug')) {
      console.debug(`[debug] ${message}`, meta ?? '');
    }
  }

  info(message: string, meta?: unknown) {
    if (this.shouldLog('info')) {
      console.info(`[info] ${message}`, meta ?? '');
    }
  }

  warn(message: string, meta?: unknown) {
    if (this.shouldLog('warn')) {
      console.warn(`[warn] ${message}`, meta ?? '');
    }
  }

  error(message: string, meta?: unknown) {
    if (this.shouldLog('error')) {
      console.error(`[error] ${message}`, meta ?? '');
    }
  }
}

export const logger = new Logger();
