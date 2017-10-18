'use strict'

var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var config = require('./config/database');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 9090;

var User  = require('./models/User');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mongoose.connect(config.database);
app.set('superSecret', config.secret);
mongoose.connection.on('open', function (ref) {
    console.log('Connected to Mongo server...');
});

app.set('superSecret', config.secret);

app.listen(port);
console.log("User Management Service is listening on: " + port);


app.post('/users', function(req, res) {

    var user = new User({
        name: req.body.name,
        password: req.body.password,
    });

    user.save(function(err) {
        if (err) {
            res.json({ success: false });
        }
        else{
            res.json({ success: true });
        }

    });
});

app.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

app.post('/login', function(req, res) {

    User.findOne({name: req.body.name, password: req.body.password}, function (err, user) {
        if (err || !user) {
            return res.json({ success: false, message: 'Authentication failed. User not found.' });
        }

        else if(user){
            var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn : '24h' // expires in 24 hours
            });

            return res.json({success: true,
                message: 'Enjoy your token!',
                token: token});
        }
        //var decoded = jwt.verify(token, 'testsecret');
        //console.log(decoded._doc.name) // bar



    });
});