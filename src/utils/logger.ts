/**
 * Simple logger utility for client-side logging
 */

const logger = {
  /**
   * Log debug messages in development only
   */
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log informational messages
   */
  info: (...args: any[]) => {
    console.log('[INFO]', ...args);
  },

  /**
   * Log warning messages
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Log error messages
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

export { logger };

export default logger;
