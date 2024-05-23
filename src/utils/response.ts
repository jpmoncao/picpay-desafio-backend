import { Request, Response } from "express"
import dotenv from 'dotenv'

dotenv.config();

export default function sendResponse(req: Request, res: Response, status: number, data: any[] | undefined, message: string, error?: any): Response {
    if (error) {
        const err = {
            "name": error.name,
            "code": error.code,
        }
        return res.status(status).json({
            error: err,
            message
        })
    }

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if (!page || page < 0)
        page = 1;
    if (!limit)
        limit = 10;
    else if (limit < 0)
        limit = 1;

    return res.status(status).json({
        _self: (process.env.API_ADDRESS ?? '') + req.originalUrl,
        message,
        data,
        page,
        limit,
    })
}
