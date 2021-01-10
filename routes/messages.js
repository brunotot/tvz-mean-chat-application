const router = require('express').Router();
const Role = require('../models/Role');
const { Chatroom } = require('../models/Chatroom');
const { Message } = require('../models/Message');
const { Attachment } = require('../models/Attachment');
const UsersValidator = require('../validators/users-validator');
const verify = require('./verify');
const httpStatus = require('http-status');
const AttachmentType = require('../models/AttachmentType');
const path = require('path');
const fs = require('fs');
const isImage = require("is-image");
const isVideo = require("is-video");

router.get('/:userId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        const requestUserId = req.user._id;
        const responseUserId = req.params.userId;
        const user1 = await UsersValidator.validateIfFoundByUserId(requestUserId);
        const user2 = await UsersValidator.validateIfFoundByUserId(responseUserId);
        const chatroom = await Chatroom.find({$or:[{'user1':user1, 'user2': user2}, {'user1':user2, 'user2': user1}]});
        res.json(chatroom.messages);
    } catch (error) {
        next(error);
    }
});

router.get('/byMessageId/:messageId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        let { messageId } = req.params;
        const message = await Message.findById(messageId);
        res.json(message);
    } catch (error) {
        next(error);
    }
});

router.get('/getAll/:messageIds', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        let { messageIds } = req.params;
        let messageIdsArray = messageIds.split(",");
        const messages = await Message.find({ _id: {$in: messageIdsArray }});
        res.json(messages);
    } catch (error) {
        next(error);
    }
});

router.post('/:receiverId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        let receiverId = req.params.receiverId;
        let senderId = req.user._id;
        const receiverUser = await UsersValidator.validateIfFoundByUserId(receiverId);
        const senderUser = await UsersValidator.validateIfFoundByUserId(senderId);
        let chatroom = await Chatroom.findOne({$or:[{'user1':receiverUser, 'user2': senderUser}, {'user1':senderUser, 'user2': receiverUser}]});
        let chatroomExists = true;
        if (!chatroom) {
            chatroom = new Chatroom();
            chatroom.user1 = senderUser;
            chatroom.user2 = receiverUser;
            chatroomExists = false;
        }
        let message = new Message();
        message.created = req.body.created;
        message.body = req.body.body;
        message.sender = senderUser;
        message.chatroomId = chatroom._id;
        let files = []
        if (req.files && req.files.files) {
            files = req.files.files;
            if (!Array.isArray(files)) {
                files = [files];
            }
        }
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let type = AttachmentType.OTHER;
            if (isImage(file.name)) {
                type = AttachmentType.IMAGE;
            } else if (isVideo(file.name)) {
                type = AttachmentType.VIDEO;
            }
            const attachment = new Attachment({
                name: file.name,
                messageId: message._id,
                type: type
            });
            let uploadPath = path.resolve(__dirname,  `../storage/attachments/${message._id}`, `${attachment._id}_${attachment.name}`);
            let dirPath = path.resolve(__dirname, `../storage/attachments/${message._id}`);
            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
            await file.mv(uploadPath);
            message.attachments.push(attachment);
        }
        await Attachment.create(message.attachments);
        let createdMessage = await Message.create(message);
        chatroom.messageIds.push(message._id);
        if (chatroomExists) {
            await Chatroom.updateOne({_id: chatroom._id}, chatroom);
        } else {
            await Chatroom.create(chatroom);
        }
        res.status(httpStatus.CREATED).json({
            _id: createdMessage._id,
            body: createdMessage.body,
            sender: createdMessage.sender,
            created: createdMessage.created,
            attachments: createdMessage.attachments,
            chatroom: chatroom
        });
    } catch (error) {
        next(error);
    }
});

module.exports = {
    messagesRoute: router
}