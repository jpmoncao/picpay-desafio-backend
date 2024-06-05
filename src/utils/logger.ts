import winston from "winston";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: __dirname + "/../../logs/error.log", level: "warn" }),
        new winston.transports.File({ filename: __dirname + "/../../logs/app.log" }),
    ],
});
