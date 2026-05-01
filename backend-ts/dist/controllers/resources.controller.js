"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResources = getResources;
exports.getResourceById = getResourceById;
exports.createResource = createResource;
exports.patchResource = patchResource;
exports.deleteResource = deleteResource;
const resources_service_1 = require("../services/resources.service");
function getResources(req, res, next) {
    try {
        const result = resources_service_1.resourcesService.getAll(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function getResourceById(req, res, next) {
    try {
        const result = resources_service_1.resourcesService.getById(req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function createResource(req, res, next) {
    try {
        const result = resources_service_1.resourcesService.create(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}
function patchResource(req, res, next) {
    try {
        const result = resources_service_1.resourcesService.patch(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
function deleteResource(req, res, next) {
    try {
        resources_service_1.resourcesService.softDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
