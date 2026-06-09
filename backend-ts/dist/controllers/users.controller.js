"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.patchUser = patchUser;
exports.deleteUser = deleteUser;
const users_service_1 = require("../services/users.service");
async function getUsers(req, res, next) {
    try {
        const result = await users_service_1.usersService.getAll(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getUserById(req, res, next) {
    try {
        const result = await users_service_1.usersService.getById(req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function createUser(req, res, next) {
    try {
        const result = await users_service_1.usersService.create(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function patchUser(req, res, next) {
    try {
        const result = await users_service_1.usersService.patch(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function deleteUser(req, res, next) {
    try {
        await users_service_1.usersService.softDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
