require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const connectDB = require('./config/dbConn');
const { default: mongoose } = require('mongoose');
const { getTodo, addTodo, updateTodo, deleteTodo } = require('./controller/todo');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }
});

const PORT = process.env.PORT || 3500

connectDB()
// middleware
app.use(express.json())
app.use(cors())// Add cors middleware


// routes
app.use('/', require('./routes/root'));

io.on('connection', (socket) => {
    console.log('a user connected');

    // Emit all existing todos to the connected client
    getTodo(socket)

    // Handle the 'addTodo' event
    socket.on('newTodo', (data) => {
        addTodo(io, data); // Join the user to a socket room
    });
    // Handle the 'addTodo' event
    socket.on('updatedTodo', (data) => {
        updateTodo(io, data); // Join the user to a socket room
    });
    // Handle the 'addTodo' event
    socket.on('deleteTodo', (data) => {
        deleteTodo(io, data); // Join the user to a socket room
    });
});


mongoose.connection.once('open', () => {
    console.log('connected to mongoDB')
    server.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    });
})
mongoose.connection.on('error', (err) => {
    console.log(err)
})