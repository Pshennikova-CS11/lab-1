const usersService = require("../services/users.service");

async function getAll(req, res, next) {
    try {
        const users = await usersService.getAllUsers(req.query);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const user = await usersService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const user = await usersService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const user = await usersService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await usersService.deleteUser(req.params.id);
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