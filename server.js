var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// socket io chat
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var appRoutes = require('./app/routes/api')(router,io);

app.use(morgan('dev'));  // log all http requests
app.use(express.static(__dirname + '/public'));
// to differentiate between backend and front end routes
app.use('/api',appRoutes);

mongoose.connect('mongodb://127.0.0.1/polymath',  { useNewUrlParser: true }, function (err) {
    if(err) {
        console.log('Error in connecting to database '+err);
    } else {
        console.log('Successfully connected to database.');
    }
});
/*
mongoose.connect(conString, { useNewUrlParser: true }, () => {
    console.log("DB is connected");
});
*/
app.get('*', function (req,res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

//socket io
io.on('connection', function(socket){
    console.log('User connected.');
    socket.on('disconnect', function () {
        console.log('User disconnected.')
    });
});

http.listen(port,function () {
    console.log('Server running on port '+ port);
});
