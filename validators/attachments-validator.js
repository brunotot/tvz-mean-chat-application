const status = require("http-status");
const ApiError = require("../errors/ApiError");

async function validateIfAnyAttachmentProvided(req) {
    if (!req.files || (Object.keys(req.files) && Object.keys(req.files).length === 0)) {
        throw new ApiError(status.BAD_REQUEST, 'No files were uploaded', 'Please, provide files for upload when consuming this endpoint');
    }
}

module.exports = {
    validateIfAnyAttachmentProvided: validateIfAnyAttachmentProvided
};