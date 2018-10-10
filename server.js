var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);

app.use(morgan('dev'));  // log all http requests
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// to differentiate between backend and front end routes
app.use('/api',appRoutes);

mongoose.connect('mongodb://127.0.0.1/polymath',  { useNewUrlParser: true }, function (err) {
    if(err) {
        console.log('Error in connecting to database.');
    } else {
        console.log('Successfully connected to database.');
    }
});

app.get('*', function (req,res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(port,function () {
    console.log('Server running on port '+ port);
});
