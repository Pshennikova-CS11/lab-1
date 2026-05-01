const resourcesService = require("../services/resources.service");

async function getAll(req, res, next) {
    try {
        const resources = await resourcesService.getAllResources(req.query);
        res.status(200).json(resources);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const resource = await resourcesService.getResourceById(req.params.id);
        res.status(200).json(resource);
    } catch (err) {
        next(err);
    }
}

async function getWithComments(req, res, next) {
    try {
        const resource = await resourcesService.getResourceWithComments(req.params.id);
        res.status(200).json(resource);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const resource = await resourcesService.createResource(req.body);
        res.status(201).json(resource);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const resource = await resourcesService.updateResource(req.params.id, req.body);
        res.status(200).json(resource);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await resourcesService.deleteResource(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAll,
    getById,
    getWithComments,
    create,
    update,
    remove
};