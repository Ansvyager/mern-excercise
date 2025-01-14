const express = require('express');
const cookieParser = require("cookie-parser");
const db = require('./config/db');
const messageBroker = require('./config/messageBroker');
const app = express();

db.connect();
db.open();

const cors = require('cors');
app.use(cors());

const server = app.listen(8080, () => console.log("WebSocket Connected..."));
const io = require('socket.io')(server, {cors: {origin: "*"}});
const socket = io.of('/');

messageBroker.connect();
messageBroker.consume(socket);

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
