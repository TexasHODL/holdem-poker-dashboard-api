import { createLogger, format, transports } from 'winston';
const { json, timestamp, combine, errors } = format;

const logger = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: 'Poker-Dashboard' },
  transports: [new transports.File({ filename: './logs/log_DDMMYYYY.log' })],
});

export default logger;
