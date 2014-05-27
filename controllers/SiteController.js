var util = require('util');
var Logger = require('devnull');
var logger = new Logger({namespacing : 0});
var fs  = require('fs');
path = require('path');
var Files =  require('../models/Files');
SiteController = function (app, mongoose, config) {
    var Files = mongoose.model('Files');
    app.get('/?', function(req, res, next) {
        if(req.session.user){
                
                Files.findOne({type:1},function(err,menuResult){
                   Files.findOne({type:2},function(err,helpResult){
                    var helpFile = helpResult.name;
                    var menuFile = menuResult.name;
                        var data = {
                            activeUser : req.session.user.username,
                            auth: req.session.user.auth,
                            helpFileUrl: helpFile,
                            menuFileUrl: menuFile
                        }
                        res.render('layout',{data:data});
                });
                });
            }else{
                res.redirect('/login');
            }
    });
    
    var deleteAfterUpload = function(path) {
        setTimeout( function(){
            fs.unlink(path, function(err) {
              if (err) console.log(err);
              console.log('file successfully deleted');
            });
          }, 60 * 1000);
    };
    
    app.get('/upload',function(req,res){
        if(req.session.user.auth>0){
            var data = {activeUser: req.session.user.username,auth:req.session.user.auth};
            res.render('file_upload',{data:data});
        }else res.render('unauthorized');
    });
    
    app.get('/files/:type',function(req,res){
        Files.find({type:req.body.type},function(err,data){
            res.json(data);
        });
    });
    
    app.post('/upload',function(req,res){
        // del
        Files.remove({type:req.body.type},function(err){});
        var filesModel = new Files();
        filesModel.name = path.basename(req.files.myFile.path);
        filesModel.uploader = req.session.user.username;
        filesModel.type = req.body.type;
        filesModel.save(function(err){});
        deleteAfterUpload(req.files.myFile.path);
        res.end();
    });
    
    app.get('/reservation',function(req,res){
        var data = {
                    activeUser: req.session.user.username,
                    auth: req.session.user.auth
                }
        res.render('reservation',{data:data});
    });
    
    app.get('/login/?',function(req,res,next){
        if(req.session.user) res.redirect('/');
        else res.render('login');
    });
    
    app.get('/userPanel',function(req,res,next){
        var data = {
                    activeUser: req.session.user.username,
                    auth: req.session.user.auth,
                    userData: req.session.user
                }
        if(req.session.user) res.render('userPanel',{data:data});
        else res.redirect('/login');
    });
    
    app.get('/404/?', function(req, res, next) {
        res.render('404');
    });

    app.get('/403/?', function(req, res, next){
        var err = new Error('not allowed!');
        err.status = 403;
        next(err);
    });

    app.get('/500/?', function(req, res, next) {
        next(new Error('Technical error occured'));
    });
}

module.exports = SiteController;