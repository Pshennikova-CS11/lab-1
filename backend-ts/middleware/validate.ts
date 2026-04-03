import { NextFunction, Request, Response } from "express";

type ValidatorFn = (body: unknown) => void;

export function validateBody(validator: ValidatorFn) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            validator(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };
}