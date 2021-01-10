const express = require('express');
const router = express.Router();
const path = require('path');
const Role = require('../models/Role');
const isVideo = require('is-video');
const isImage = require('is-image');
const AttachmentType = require('../models/AttachmentType');
const MessagesValidator = require('../validators/messages-validator');
const UsersValidator = require('../validators/users-validator');
const AttachmentsValidator= require('../validators/attachments-validator');
const { Attachment } = require('../models/Attachment');
const { Chatroom } = require('../models/Chatroom');
const { Message } = require('../models/Message');
const verify = require('./verify');
const fs = require('fs');
const ApiError = require('../errors/ApiError');

router.post('/upload-location/:userId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        let requestUserId = req.user._id;
        let responseUserId = req.params.userId;
        await MessagesValidator.validateIfApplicantNotEqualsMessageOwner(req, responseUserId);
        const requestUser = await UsersValidator.validateIfFoundByUserId(requestUserId);
        const responseUser = await UsersValidator.validateIfFoundByUserId(responseUserId);
        let { longitude, latitude, message} = req.body;
        let newAttachment = {
            name: 'location',
            fullPathName: 'location',
            type: AttachmentType.LOCATION,
            latitude: latitude,
            longitude: longitude
        };
        let createdAttachment = await Attachment.create(newAttachment);
        let newMessage = {
            body: message.body,
            created: message.created,
            attachments: [createdAttachment],
            sender: requestUser
        }
        let createdMessage = await Message.create(newMessage);
        let chatroom = await Chatroom.findOne({$or:[{'user1':requestUser, 'user2': responseUser}, {'user1':responseUser, 'user2': requestUser}]});
        if (chatroom) {
            chatroom.messageIds.push(createdMessage._id);
            await Chatroom.updateOne(
                {_id: chatroom._id},
                { $set: {messageIds: chatroom.messageIds}}
            );
        } else {
            chatroom = await Chatroom.create({
                user1: requestUser,
                user2: responseUser,
                messageIds: [createdMessage._id]
            });
        }
        res.json({
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

router.post('/upload/:messageId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        const { messageId } = req.params;
        let message = await MessagesValidator.validateIfMessageFoundById(messageId);
        let chatroom = await Chatroom.findOne({messages: {$elemMatch: {_id: message._id}}});
        let index = -1;
        for (var i = 0; i < chatroom.messages.length; i++) {
            if (JSON.stringify(chatroom.messages[i]._id) == JSON.stringify(message._id)) {
                index = i;
                break;
            }
        }
        await AttachmentsValidator.validateIfAnyAttachmentProvided(req);
        let files = req.files.files;
        if (files && !Array.isArray(files)) {
            files = [files];
        }
        for (let file of files) {
            var type = AttachmentType.OTHER;
            if (isImage(file.name)) {
                type = AttachmentType.IMAGE;
            } else if (isVideo(file.name)) {
                type = AttachmentType.VIDEO;
            }
            const attachment = new Attachment({
                name: file.name,
                messageId: messageId,
                type: type 
            });
            const savedAttachment = await Attachment.create(attachment);
            message.attachments.push(savedAttachment);

            var uploadPath = path.resolve(__dirname,  `../storage/attachments/${messageId}`, `${savedAttachment._id}_${savedAttachment.name}`);
            var dirPath = path.resolve(__dirname, `../storage/attachments/${messageId}`);
            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath);
            }
            await file.mv(uploadPath);
        }
        chatroom.messages[index] = message;
        await Message.updateOne({ _id: messageId }, message);
        await Chatroom.updateOne({_id: chatroom._id}, { $set: {messages: chatroom.messages}});
        res.json({
            created: message.created,
            _id: message._id,
            sender: message.sender,
            attachments: message.attachments,
            chatroom: chatroom
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:attachmentId', verify(Role.ADMIN, Role.USER), async (req, res, next) => {
    try {
        let { attachmentId } = req.params;
        let attachment = await Attachment.findById({_id: attachmentId});
        let message = await Message.findById({_id: attachment.messageId});
        let chatroom = await Chatroom.findById({_id: message.chatroomId});
        let requestUserId = req.user._id;
        if (requestUserId != chatroom.user1._id && requestUserId != chatroom.user2._id) {
            throw new ApiError(403, "Forbidden", "You cannot view attachments that you did not send or receive");
        }
        let file = `storage/attachments/${attachment.messageId}/${attachment.id}_${attachment.name}`;
        res.download(file);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    attachmentsRoute: router
}