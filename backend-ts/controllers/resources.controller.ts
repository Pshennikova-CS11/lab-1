import { Request, Response, NextFunction } from "express";
import { resourcesService } from "../services/resources.service";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.getAll(req.query);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.getById(Number(req.params.id));
        res.status(200).json({ item: data });
    } catch (err) {
        next(err);
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.create(req.body);
        res.status(201).json({ item: data });
    } catch (err) {
        next(err);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.update(Number(req.params.id), req.body);
        res.status(200).json({ item: data });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resourcesService.remove(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const getWithComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.getWithComments(Number(req.params.id));
        //отримує id ресурсу з параметрів запиту, передає його в service
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};

export const getAvgRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.getAvgRating(Number(req.params.id));
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};

export const getWithDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await resourcesService.getWithDetails(req.query);
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};