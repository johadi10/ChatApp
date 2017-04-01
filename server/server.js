const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

const {generateMessage, generateLocationMessage}=require('./utils/message');
const publicPath=path.join(__dirname,'../public');
var port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);

app.use(express.static(publicPath));
var io=socketIO(server);//open a connection from server to the client which allows server to send and listen to data from client sides(browsers)

io.on('connection',(socket)=>{
    console.log('a new user is connected');

    socket.emit('newMessage',generateMessage('Admin','welcome to the chat'));
    socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined the chat'));
    
    socket.on('createMessage',(message,callback)=>{
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback();
    });
    socket.on('createLocationMessage',(coord)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coord.latitude,coord.longitude));
    })


    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});

server.listen(port,(err)=>{
    if(err) return console.error(err);
    console.log(`server is running on port ${port}`);
});
