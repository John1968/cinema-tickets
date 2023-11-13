import dwpNodeLogger from '@dwp/node-logger'
import { LOGGING_LEVEL } from './Config'

const logger = dwpNodeLogger('api', { logLevel: LOGGING_LEVEL.toLowerCase() });

module.exports = logger;
