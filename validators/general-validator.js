const status = require("http-status");
const ApiError = require("../errors/ApiError");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

async function validateIfProperObjectId(objectId) {
    if (!ObjectId.isValid(objectId)) {
        throw new ApiError(status.BAD_REQUEST, `Bad ObjectId`, `Invalid ObjectId was provided (ObjectId = ${objectId})`);
    }
}

module.exports = {
    validateIfProperObjectId: validateIfProperObjectId
};