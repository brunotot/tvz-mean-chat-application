const mongoose = require('mongoose');
const { AttachmentSchema } = require('./Attachment');
const { UserSchema } = require('./User');

const MessageSchema = mongoose.Schema({
    sender: {
        type: UserSchema,
        required: true
    },
    body: {
        type: String,
        validate: {
            validator: function (value) {
                return (value && value.length) || (this.attachments && this.attachments.length);
            },
            msg: 'Message body cannot be empty',
        }
    },
    created: {
        type: Date,
        default: Date.now()
    },
    attachments: {
        type: [AttachmentSchema],
        default: []
    },
    chatroomId: {
        type: String,
        default: ''
    }

});

module.exports = {
    Message: mongoose.model('Messages', MessageSchema),
    MessageSchema: MessageSchema
}