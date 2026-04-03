/* контролер приймає HTTP-запит, викликає service і формує HTTP-відповідь */
const usersService = require("../services/users.service");

/* DTO використовується для формування контрольованої відповіді,
 а не повернення внутрішньої моделі напряму */
const { toUserResponseDto } = require("../dtos/users.dto");

function getAll(req, res, next) {
    try {
        const users = usersService.getAllUsers();
        res.status(200).json(users.map(toUserResponseDto));
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        const user = usersService.getUserById(req.params.id);
        res.status(200).json(toUserResponseDto(user));
    } catch (err) {
        next(err);
    }
}

function create(req, res, next) {
    try {
        const user = usersService.createUser(req.body);
        res.status(201).json(toUserResponseDto(user));
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        const user = usersService.updateUser(req.params.id, req.body);
        res.status(200).json(toUserResponseDto(user));
    } catch (err) {
        next(err);
    }
}

function remove(req, res, next) {
    try {
        usersService.deleteUser(req.params.id);
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