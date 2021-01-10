const Role = require('../models/Role');
const verify = require('./verify');
const express = require('express');
const router = express.Router();
const { User } = require('../models/User')
const UsersUtil = require('../utils/users-util');
const { validateIfFoundByUserId, validateIfNotFoundByUsername, validateIfProperRegisterBody, validateIfAllowed } = require('../validators/users-validator');
const { validateIfProperObjectId } = require('../validators/general-validator');
const status = require('http-status');
const AuthUtil = require('../utils/auth-util');

router.get('/', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        const users = await User.find();
        const dto = UsersUtil.convertResultToDto(users);
        res.json(dto);
    } catch (error) {
        next(error);
    }
});

router.get('/:userId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        const { userId } = req.params;
        await validateIfProperObjectId(userId);
        const user = await validateIfFoundByUserId(userId);
        const dto = UsersUtil.convertResultToDto(user);
        res.json(dto);
    } catch (error) {
        next(error);
    }
});

router.post('/', verify(Role.ADMIN), async (req, res, next) => {
    try {
        await validateIfProperRegisterBody(req.body);
        await validateIfNotFoundByUsername(req.body.username);
        const hashedPassword = await AuthUtil.hash(req.body.password);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role.toUpperCase()
        })
        const savedUser = await user.save();
        const dto = UsersUtil.convertResultToDto(savedUser);
        res.status(status.CREATED).json(dto);
    } catch (error) {
        next(error);
    }
});

router.delete('/:userId', verify(Role.ADMIN), async (req, res, next) => {
    try {
        const { userId } = req.params;
        await validateIfFoundByUserId(userId);
        await User.deleteOne({ _id: userId });
        res.json(userId);
    } catch (error) {
        next(error);
    }
});

router.patch('/:userId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await validateIfFoundByUserId(userId);
        var newUser = {
            username: req.body.username ? req.body.username : user.username,
            password: req.body.password ? req.body.password : user.password,
            firstName: req.body.firstName ? req.body.firstName : user.firstName,
            lastName: req.body.lastName ? req.body.lastName : user.lastName,
            role: req.body.role ? req.body.role.toUpperCase() : user.role
        };
        await validateIfProperRegisterBody(newUser);
        if (req.body.password) {
            newUser.password = await AuthUtil.hash(req.body.password);
        }
        await User.updateOne({ _id: userId }, { $set: newUser });
        const dto = UsersUtil.convertResultToDto(newUser);
        res.json(dto);
    } catch (error) {
        next(error);
    }
});

router.put('/:userId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        let { userId } = req.params;
        await validateIfFoundByUserId(userId);
        await validateIfAllowed(req, userId);
        await validateIfProperRegisterBody(req.body);
        const hashedPassword = await AuthUtil.hash(req.body.password);
        const newUser = {
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role.toUpperCase()
        }
        await User.updateOne({ _id: userId }, newUser);
        const dto = UsersUtil.convertResultToDto(newUser);
        res.json(dto);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    usersRoute: router,
}