"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWithDetails = exports.getAvgRating = exports.getWithComments = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const resources_service_1 = require("../services/resources.service");
const getAll = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.getAll(req.query);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.getById(Number(req.params.id));
        res.status(200).json({ item: data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.create(req.body);
        res.status(201).json({ item: data });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.update(Number(req.params.id), req.body);
        res.status(200).json({ item: data });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        await resources_service_1.resourcesService.remove(Number(req.params.id));
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
const getWithComments = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.getWithComments(Number(req.params.id));
        //отримує id ресурсу з параметрів запиту, передає його в service
        res.status(200).json({ data });
    }
    catch (err) {
        next(err);
    }
};
exports.getWithComments = getWithComments;
const getAvgRating = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.getAvgRating(Number(req.params.id));
        res.status(200).json({ data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAvgRating = getAvgRating;
const getWithDetails = async (req, res, next) => {
    try {
        const data = await resources_service_1.resourcesService.getWithDetails(req.query);
        res.status(200).json({ data });
    }
    catch (err) {
        next(err);
    }
};
exports.getWithDetails = getWithDetails;
