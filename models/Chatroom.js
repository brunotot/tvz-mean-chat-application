const mongoose = require('mongoose');
const { MessageSchema } = require('./Message');
const { UserSchema } = require('./User');

const ChatroomSchema = mongoose.Schema({
    user1: {
        type: UserSchema,
        required: true
    },
    user2: {
        type: UserSchema,
        required: true
    },
    messageIds: {
        type: [String],
        default: []
    }
});

module.exports = {
    Chatroom: mongoose.model('Chatrooms', ChatroomSchema),
    ChatroomSchema: ChatroomSchema
}