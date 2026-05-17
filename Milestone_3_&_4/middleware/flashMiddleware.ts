import { NextFunction, Request, Response } from "express";

export function flashMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session.flashMessage) {
        res.locals.message = req.session.flashMessage;
        delete req.session.flashMessage;
    } else {
        res.locals.message = undefined;
    }
    next();
};