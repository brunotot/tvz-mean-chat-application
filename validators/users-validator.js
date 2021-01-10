const status = require("http-status");
const ApiError = require("../errors/ApiError");
const { User } = require("../models/User");
const { registerValidation, loginValidation } = require("./users-schema-validator");
const bcrypt = require('bcryptjs');
const Role = require("../models/Role");

async function validateIfFoundByUserId(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(status.NOT_FOUND, `Bad ID`, `User not found (id = ${userId})`);
    }
    return user;
}

async function validateIfNotFoundByUsername(username) {
    const user = await User.findOne({ username: username });
    if (user) {
        throw new ApiError(status.NOT_FOUND, `Bad username`, `User already exists (username = ${username})`);
    }
    return user;
}

async function validateIfFoundByUsername(username) {
    const user = await User.findOne({ username: username });
    if (!user) {
        throw new ApiError(status.NOT_FOUND, `Bad username`, `Invalid username provided (username = ${username})`);
    }
    return user;
}

async function validateIfProperRegisterBody(body) {
    const { error } = registerValidation(body);
    if (error) {
        throw new ApiError(status.NOT_FOUND, "Bad request body", error.details[0].message);
    }
}

async function validateIfProperLoginBody(body) {
    const { error } = loginValidation(body);
    if (error) {
        throw new ApiError(status.NOT_FOUND, "Bad request body", error.details[0].message);
    }
}

async function validateIfAllowed(req, userId) {
    if (req.user.role == Role.USER && req.user._id != userId) {
        throw new ApiError(status.FORBIDDEN, 'No privileges', `You don't have the privileges to execute the following action/s on user with id ${userId}`);
    }
}

async function validateIfPasswordsMatch(password, hashedPassword) {
    const validPassword = await bcrypt.compare(password, hashedPassword);
    if (!validPassword) {
        throw new ApiError(status.BAD_REQUEST, "Invalid credentials", "Username or password is invalid");
    }
}

module.exports = {
    validateIfFoundByUserId: validateIfFoundByUserId,
    validateIfNotFoundByUsername: validateIfNotFoundByUsername,
    validateIfProperLoginBody: validateIfProperLoginBody,
    validateIfProperRegisterBody: validateIfProperRegisterBody,
    validateIfAllowed: validateIfAllowed,
    validateIfPasswordsMatch: validateIfPasswordsMatch,
    validateIfFoundByUsername: validateIfFoundByUsername
};