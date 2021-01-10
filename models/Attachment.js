const mongoose = require('mongoose');
const AttachmentType = require('./AttachmentType');

const AttachmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        required: true,
        enum: [AttachmentType.LOCATION, AttachmentType.OTHER, AttachmentType.IMAGE, AttachmentType.VIDEO]
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    }
});

module.exports = {
    Attachment: mongoose.model('Attachments', AttachmentSchema),
    AttachmentSchema: AttachmentSchema
}