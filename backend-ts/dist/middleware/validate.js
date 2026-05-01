"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
function validateBody(validator) {
    return (req, res, next) => {
        try {
            validator(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
