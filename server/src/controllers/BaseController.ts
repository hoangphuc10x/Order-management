import { Response, Request } from 'express';

export abstract class BaseController {
    protected sendResponse(res: Response, statusCode: number, data: any) {
        res.status(statusCode).json(data);
    }

    protected sendError(res: Response, statusCode: number, message: string) {
        res.status(statusCode).json({ error: message });
    }
}