"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
exports.errorHandler = {
    handleErrors: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Server error");
    },
    handle404: (req, res, next) => {
        res.status(404).send("Sorry, that route doesn't exist.");
    },
};
