"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMw = void 0;
const express_validator_1 = require("express-validator");
const index_1 = require("../index");
const inputValidationMw = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(index_1.STATUSES_HTTP.BAD_REQUEST_400)
            .json({
            errorsMessages: result.array({ onlyFirstError: true }).map(val => ({
                "message": val.msg,
                //@ts-ignore
                "field": val["path"]
            }))
        });
    }
    else {
        next();
    }
};
exports.inputValidationMw = inputValidationMw;