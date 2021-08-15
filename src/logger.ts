import winston, { format } from "winston";


const formatter = format.printf((info) => {
  const { level, message, label, timestamp } = info;
  return `[${info.module || "all"}][${timestamp}][${level}]: ${message}`;
});


const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
  ],
  format: format.combine(
    format.timestamp(),
    formatter,
  ),
});


export default logger;
