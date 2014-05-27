/*
@author        : Furkan BAŞARAN
@start-date    : 17.05.2014
@project       : TOYOTA JAPAN RESTAURANT SOFTWARE
*/

/* Module requires */
var express    = require('express'),
    http       = require('http'),
    path       = require('path'),
    mongoose   = require('mongoose'),
    mongoStore = require('connect-mongo')(express),
    config     = require('config'),
    utils      = require('./lib/utils'),
    ENV        = process.env.NODE_ENV || 'development';

/* Express app defining */
var app = express();

/* Mongoose connection settings defining from config file */
mongoose = utils.connectToDatabase(mongoose,config.db);

/* Application configurations */
app.configure('all',function(){
     app.set('port',process.env.PORT || 5454);
     app.set('views',__dirname + '/views');
     app.set('view engine','ejs');
     app.set('view options',{layout:true});
     app.use(express.logger('dev'));
     app.use(express.cookieParser());
     /* store session datas in mongoStore */
     app.use(express.session({
        secret: 'toyoToyoTa',
        cookie: {maxAge: 24*60*60*999},
        store : new mongoStore({
            url: utils.dbConnectionUrl(config.db)
        })
     }));
     app.use(express.bodyParser({
        keepExtensions: true, 
        uploadDir: __dirname + '/public/files',
        limit: '2mb'        
     }));
     app.use(express.methodOverride());
     app.use(express.static(path.join(__dirname,'public')));
     app.use(function(req,res,next){
         res.locals.session = req.session;
         next();
     });
});

/* Error handling setup */
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

/* Including models */
require('./models/Reservation')(mongoose);  
require('./models/User')(mongoose);
require('./models/Restaurant')(mongoose);
require('./models/Files')(mongoose);

/* Including controllers */
['Reservation', 'Site', 'User','Restaurant'].forEach(function (controller) {
    require('./controllers/' + controller + 'Controller')(app, mongoose, config);
});

process.on('uncaughtException', function(err) {
    console.log(err);
});

module.exports = app;

app.listen(app.get('port'));

