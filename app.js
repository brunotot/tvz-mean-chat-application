require('dotenv/config');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const globalErrorHandler = require('./errors/global-error-handler');
const { authRoute } = require('./routes/auth');
const { usersRoute } = require('./routes/users');
const { messagesRoute } = require('./routes/messages');
const { chatroomsRoute } = require('./routes/chatrooms');
const { attachmentsRoute } = require('./routes/attachments');
const io = require('socket.io')(http, {cors: { origin: "http://localhost:4200", methods: ["*"], allowedHeaders: ["*"] }});
const fs = require('fs');
const path = require('path');

let directory = path.resolve(__dirname,  `storage/attachments`);
if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
}

// Middlewares
app.use(express.static('public'))
app.use(fileUpload({ useTempFiles : true, tempFileDir : '/tmp/' }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/messages', messagesRoute);
app.use('/chatrooms', chatroomsRoute);
app.use('/attachments', attachmentsRoute);
app.use(globalErrorHandler);

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log("Connected to database");
});

// Configure server to listen on http://localhost:3000
http.listen(3000, (res) => {
    console.log("Listening on http://localhost:3000");
});

io.on('connection', (socket) => {

    socket.on('message send', (data) => {
        let { senderId, receiverId } = data;
        let senderResult = {...data.result};
        let receiverResult = {...data.result};
        socket.emit(`message-receive/${senderId}`, senderResult);
        io.sockets.emit(`message-receive/${receiverId}`, receiverResult);
    });

});