const express = require('express');
const verify = require('./verify');
const { Chatroom } = require('../models/Chatroom');
const { Message } = require('../models/Message');
const { Attachment } = require('../models/Attachment');
const router = express.Router();
const Role = require('../models/Role');
const UsersValidator = require('../validators/users-validator');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

router.get('/self', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        const requestUserId = req.user._id;
        const requestUser = await UsersValidator.validateIfFoundByUserId(requestUserId);
        const chatrooms = await Chatroom.find({$or: [{user1: requestUser}, {user2: requestUser}]});
        return res.json(chatrooms);
    } catch (error) {
        next(error);
    }
});

router.delete('/', verify(Role.ADMIN), async (req, res, next) => {
    try {
        await Chatroom.deleteMany({});
        await Message.deleteMany({});
        await Attachment.deleteMany({});
        let directory = path.resolve(__dirname,  `../storage/attachments`);
        await fsPromises.rmdir(directory, { recursive: true });
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        res.json({result: "success"});
    } catch (error) {
        next(error);
    }
});

module.exports = {
    chatroomsRoute: router
}