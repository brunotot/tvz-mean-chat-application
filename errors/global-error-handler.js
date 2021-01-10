const ApiError = require('./ApiError');
const status = require('http-status');

function globalErrorHandler(error, req, res, next) {
    if (error instanceof ApiError) {
        res.status(error.status).json({
            error: error.title,
            message: error.description
        });
    } else {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            error: error.name,
            stack: error.stack
        });
    }
}

module.exports = globalErrorHandler;