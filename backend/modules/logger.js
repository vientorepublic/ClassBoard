import winston, { format } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
const { combine, timestamp, printf } = format;

const customFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

export const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        customFormat,
    ),
    transports: [
        new winston.transports.Console(),

        new winstonDaily({
            level: 'info',
            datePattern: 'YYYYMMDD',
            dirname: './logs',
            filename: `VientoEngine_%DATE%.log`,
            maxSize: null,
            maxFiles: 14
        }),
    ],
});

export const stream = {
    write: message => {
        logger.info(message);
    }
}