const mongoose = require('mongoose');
const Role = require('./Role');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        min: 5
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    role: {
        type: String,
        required: true,
        enum: [Role.ADMIN, Role.USER]
    }
});

module.exports = {
    User: mongoose.model('Users', UserSchema),
    UserSchema: UserSchema
}