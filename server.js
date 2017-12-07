const express = require('express');
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io').listen(server);
const mongo   = require('mongodb');

mongo.connect('mongodb://127.0.0.1/app', function(err, db) {
    if (err) {
        throw (err);
    }

    console.log('MongoDB connected');

    io.on('connection', function() {
        //let chat = db.collection('chats');

        // Create function to send status
        sendStatus = function(s) {
            socket.emit('status', s);
        }

        // get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if (err) {
                throw err;
            }
            //emit messages
            socket.emit('output', res);
        });
        
        socket.on('input', function(data) {
            let name = data.name;
            let message = data.message;
            
            if (name == '' || messge == '') {
                // Send error status
                sendStatus('Please type something');
            } else {
                // insert message
                chat.insert({name: name, message: message}, function() {
                    io.emit('output', [data]);

                    // send status object
                    sendStatus({
                        message: 'Message send',
                        clear: true
                    });
                });
            }
        });

        // handle clear
        socket.on('clear', function(data) {
            // remove all chats from collection
            chat.remove({}, function() {
                // emit cleared
                socket.emit('cleared');
            });
        });
    });
})

/*
const url = "/client/chatroom.html";

request(url, function(err, req, res, body) {
    const $ = cheerio.load(body, {
        ignoreWhitespace: true
    });
})
*/
users        = [];
connections  = [];


server.listen(process.env.PORT || 3000);
console.log('Server on');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/channel/community.html');
    /*res.render('community', {
        title='chatroom'
    })*/
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('connected: %s sockets connected: ', connections.length);

    // disconnect
    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('disconnect: %s sockets connected: ', connections.length);
    });

    // send message
    socket.on('send message', function(data) {
        console.log(data);
        io.sockets.emit('new message', {msg: data});
    });
});
