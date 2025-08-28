/**
 * Logger utility for debugging application
 */
export const logger = {
  enabled: true, // Set false di production

  /**
   * Log general application message
   * @param component Component name
   * @param action Action being performed
   * @param data Optional data
   */
  log: (component: string, action: string, data?: any) => {
    if (logger.enabled) {
      console.log(`[${component}] ${action}`, data || "");
    }
  },

  /**
   * Log warning message
   * @param component Component name
   * @param action Action being performed
   * @param data Optional data
   */
  warn: (component: string, action: string, data?: any) => {
    if (logger.enabled) {
      console.warn(`[WARN:${component}] ${action}`, data || "");
    }
  },

  /**
   * Log errors
   * @param component Component name
   * @param action Action that caused error
   * @param error Error object
   */
  error: (component: string, action: string, error: any) => {
    if (logger.enabled) {
      console.error(`[ERROR:${component}] ${action}`, error);
    }
  },
};
