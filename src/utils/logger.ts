import Logger from 'pino'
import config from '../config'

export const logger = Logger({ level: config.logLevel })

export function getLogger(module: string) {
  return logger.child({ module })
}
