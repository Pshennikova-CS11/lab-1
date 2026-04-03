const resourcesService = require("../services/resources.service");
const { toResourceResponseDto } = require("../dtos/resources.dto");

function getAll(req, res, next) {
    try {
        const resources = resourcesService.getAllResources(req.query);
        res.status(200).json(resources.map(toResourceResponseDto));
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        const resource = resourcesService.getResourceById(req.params.id);
        res.status(200).json(toResourceResponseDto(resource));
    } catch (err) {
        next(err);
    }
}

function create(req, res, next) {
    try {
        const resource = resourcesService.createResource(req.body);
        res.status(201).json(toResourceResponseDto(resource));
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        const resource = resourcesService.updateResource(req.params.id, req.body);
        res.status(200).json(toResourceResponseDto(resource));
    } catch (err) {
        next(err);
    }
}

function remove(req, res, next) {
    try {
        resourcesService.deleteResource(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};