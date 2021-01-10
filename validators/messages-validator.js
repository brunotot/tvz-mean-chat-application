const status = require("http-status");
const ApiError = require("../errors/ApiError");
const { Message } = require("../models/Message");

async function validateIfMessageFoundById(messageId) {
    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(status.NOT_FOUND, "Message not found", `Message (id = ${messageId}) not found`);
    }
    return message;
}

async function validateIfApplicantEqualsMessageOwner(req, messageOwnerId) {
    if (req.user.id != messageOwnerId) {
        throw new ApiError(status.FORBIDDEN, "Not allowed", "You are not allowed to modify a message of which you are not owner (sender)");
    }
}

async function validateIfApplicantNotEqualsMessageOwner(req, messageOwnerId) {
    if (req.user._id == messageOwnerId) {
        throw new ApiError(status.FORBIDDEN, "Not allowed", "Unable to send a message to yourself");
    }
}

module.exports = {
    validateIfMessageFoundById: validateIfMessageFoundById,
    validateIfApplicantEqualsMessageOwner: validateIfApplicantEqualsMessageOwner,
    validateIfApplicantNotEqualsMessageOwner: validateIfApplicantNotEqualsMessageOwner
}