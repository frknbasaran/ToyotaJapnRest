var util   = require('util');
var Logger = require('devnull');
var logger = new Logger({namespacing : 0});
var User   = require('../models/User');
var crypto = require('crypto');
//var io     = require('socket.io').listen(4444);

UserController = function(app, mongoose, config){
    var User = mongoose.model('User');
    
    /* handle login post request */
    app.post('/login',function(req,res,next){
        util.log(req.method + " request to url : " + req.route.path);
        var username  = req.body.username;
        var password  = req.body.password;
        password      = crypto.createHash('md5').update(password).digest('hex');
        User.findOne({username:username,password:password},function(err,userInfo){
            if(err){
                    res.json({'status':'error'});
            }else{
                if(userInfo){
                    req.session.user = userInfo;
                    res.json({'status':'ok'});
                }else{
                    res.json({'status':'error'});
                }
            }
        });
    });
    
    
    app.get('/test',function(req,res){
        res.render('test');
    });
    
    /*io.sockets.on('connection',function(socket){
  
	
	   socket.on('test',function(data){
            var u = new User();
            u.username = data.username;
            u.email = 'asdasdqw';
            u.name  = 'asd';
            u.password = crypto.createHash('md5').update('123').digest("hex");
            
            
           u.save(function(err){
                if(!err) socket.emit('message',{"message":"ok"});
                else socket.emit('message',err);
           });
       });

	   socket.on('disconnect',function(){
            io.sockets.emit("message", {message:"client disconnected"});
	   });
    });
    */
    /* create a new user */
    
    app.post('/register/?', function(req, res, next) {
        if(req.session.user.auth>0){
            util.log(req.method + " request to url : " + req.route.path);
            var name       = req.body.name;
            var email      = req.body.email;
            var password   = req.body.password;
            var username   = req.body.username;
            var auth       = req.body.auth;
            var userModel = new User();
            userModel.email = email;
            userModel.name  = name;
            userModel.password = crypto.createHash('md5').update(password).digest("hex");
            userModel.username = username;
            userModel.auth = auth;
            userModel.save(function(err) {
                if (err) {
                    res.json({status:'error'});
                } else {
                    res.json({status:'ok'});
                }
            });
        }else{
                res.json({status:'unauthorized'});
        }
    });
    
    /* new user creating form url handling to render */
    app.get('/new-user', function(req, res, next) {
        if(req.session.user.auth>0){
            util.log(req.method + " request to url : " + req.route.path);
            var data = {activeUser: req.session.user.username,auth:req.session.user.auth}
            res.render('new-user',{data:data});
        }else{
                res.render('unauthorized');  
        }
    });
    
    /* app.get('/edit-user/:id',function(req,res,next){
        if(req.session.user.auth>0){
            var id = req.params['id'];
            User.findOne({_id:id},function(err,userInfo){
                if(err){
                        res.json({'status':'error'});
                }else{
                    var data = {
                        _id : userInfo.id,
                        activeUser:req.session.user.username,
                        name:userInfo.name,
                        username:userInfo.username,
                        email:userInfo.email,
                        password:userInfo.password,
                        auth:req.session.user.auth
                    }
                    res.render('edit-user',{data:data});
                }
            });
        }else{
            res.render('unauthorized');  
        }
    }); */
    
    /* app.post('/edit-user',function(req,res,next){
        if(req.session.user.auth>0){
            util.log(req.method + " request to url : " + req.route.path);
            var data = {
                id : req.body.id,
                name : req.body.name,
                username : req.body.username,
                password : crypto.createHash('md5').update(req.body.password).digest("hex"),
                email   : req.body.email,
                auth    : req.body.auth
            }
            User.findByIdAndUpdate(data.id,{name:data.name,username:data.username,password:data.password,email:data.email,auth:data.auth},function(err){
                if(!err) res.json({"status":"ok"});
                else res.json({"status":"error"});
            });    
        }else{
            res.json({status:'unauthorized'});
        }
    }); */
    
    app.post('/delete-user',function(req,res,next){
        if(req.session.user.auth>0){
            util.log(req.method + " request to url : " + req.route.path);
            var id = req.body.id;
            User.findByIdAndRemove(id,function(err){
                if(err) res.json({"status":"error"});
                else res.json({"status":"ok"});
            });
        }else{
            res.json({status:'unauthorized'});
        }
    });
    
    app.get('/users',function(req,res,next){
        if(req.session.user.auth>0){
            util.log(req.method + " request to url : " + req.route.path);
            User.find({},function(err,userList){
                var data = {
                    activeUser: req.session.user.username,
                    auth:   req.session.user.auth,
                    userList: userList
                }
                if(!err) res.render('users',{data:data});
                else res.send('status','error. not found user.');
            });
        }else{
             res.render('unauthorized');  
        }
    });
    
    app.post('/updatePassword',function(req,res){
        var old = crypto.createHash('md5').update(req.body.old).digest("hex");
        var newPass = crypto.createHash('md5').update(req.body.newPass).digest("hex");
        User.count({_id:req.session.user._id,password:old},function(err,data){
            if(err) res.json({"status":"error"});
            else{
                if(data<1) res.json({"status":"wrong-pass"});
            }
        });
        User.findByIdAndUpdate(req.session.user._id,{password:newPass},function(err){
            if(!err) res.json({"status":"ok"});
            else res.json({"status":"error"});
        });
    });
    
    app.post('/updateEmail',function(req,res){
        var pass     = crypto.createHash('md5').update(req.body.pass).digest("hex");
        var newEmail = req.body.newEmail;
        User.count({_id:req.session.user._id,password:pass},function(err,data){
            if(err) res.json({"status":"error"});
            else{
                if(data<1) res.json({"status":"wrong-pass"});
            }
        });
        User.count({email:newEmail},function(err,data){
            if(err) res.json({"status":"error"});
            else{
                if(data<1){
                    User.findByIdAndUpdate(req.session.user._id,{email:newEmail},function(err){
                        if(!err) res.json({"status":"ok"});
                        else res.json({"status":"error"});
                    });        
                }else{
                        res.json({"status":"email-used"});
                }
            }
        });
        
    });
    
    app.get('/userlist/:key',function(req,res){
        User.find({username:new RegExp(req.params.key)},function(err,data){
            res.json(data);
        });
    });
    
    /* logout and destroy session datas */
    app.get('/logout/?', function(req, res, next) {
        util.log(req.method + " request to url : " + req.route.path);
        if (req.session) {
            req.session.user = undefined;
            req.session.destroy(function(){});
        }
        res.redirect('/');
    });
}

module.exports = UserController;