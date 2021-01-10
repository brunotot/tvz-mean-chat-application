const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UsersValidator = require('../validators/users-validator');
const Role = require('../models/Role');
const AuthUtil = require('../utils/auth-util');
const UsersUtil = require('../utils/users-util');
const { User } = require('../models/User');

router.post('/register', async (req, res, next) => {
    try {
        await UsersValidator.validateIfProperRegisterBody(req.body);
        await UsersValidator.validateIfNotFoundByUsername(req.body.username);
        const hashedPassword = await AuthUtil.hash(req.body.password);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashedPassword,
            role: Role.USER
        });
        const savedUser = await user.save();
        const dto = UsersUtil.convertResultToDto(savedUser);
        res.json(dto);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        await UsersValidator.validateIfProperLoginBody(req.body);
        const user = await UsersValidator.validateIfFoundByUsername(req.body.username);
        await UsersValidator.validateIfPasswordsMatch(req.body.password, user.password);
        const dto = UsersUtil.convertResultToDto(user);
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET);
        res.header('token', token).json({ user: dto, token: token});
    } catch (error) {
        next(error);
    }
});

module.exports = {
    authRoute: router
}