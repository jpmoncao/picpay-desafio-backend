import dotenv from 'dotenv';
import { TRequest } from "../types/TRequest";
import { Response } from "express";

import { logger } from "./logger.js";

dotenv.config();

/**
 * 
 * @param req Request do router
 * @param res Response do router
 * @param status Http status da resposta
 * @param data Dados para serem retornados (opcional)
 * @param message Mensagem da resposta
 * @param error Erro para ser retornado (opcional)
 * @returns Retorna json da resposta
 */
export default function sendResponse(req: TRequest, res: Response, status: number, data: any[] | undefined, message: string, error?: any): Response {
    if (error) {
        const err = {
            "name": error.name,
            "code": error.code,
            "message": error.message,
            "stack": process.env.NODE_ENV === 'development' ? error.stack : undefined,
        };

        logger.error(message === '' || !message ? error.message : message);

        return res.status(status).json({
            error: err,
            message: message === '' || !message ? error.message : message
        });
    }

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if (!page || page < 0)
        page = 1;
    if (!limit)
        limit = 10;
    else if (limit < 0)
        limit = 1;

    logger.log('info', message);

    return res.status(status).json({
        _self: {
            href: (process.env.API_ADDRESS ?? '') + req.originalUrl,
            method: req.method
        },
        message,
        data,
        meta: {
            page,
            limit,
            count: data?.length
        }
    });
}
