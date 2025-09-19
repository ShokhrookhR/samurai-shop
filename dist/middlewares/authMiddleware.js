"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    if (req.headers.authorization === 'Basic S3VrdTpsdWx1') {
        next();
        return;
    }
    res.sendStatus(401);
};
exports.authMiddleware = authMiddleware;
