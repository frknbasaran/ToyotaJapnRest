var util        =   require('util');
var Logger      =   require('devnull');
var logger      =   new Logger({namespacing:0});
var Reservation =   require('../models/Reservation');
var User        =   require('../models/User');
ReservationController = function(app,mongoose,config){
    var Reservation = mongoose.model('Reservation');
    var User        = mongoose.model('User');
    /* List all reservations from database */
    app.post('/reservation_query',function(req,res){
        var start = req.body.start;
        var end   = req.body.end;
        if(req.body.user){
            var user = req.body.user;
            Reservation.count({username:user, date : { $gte: start, $lte: end }},function(err,cnt){
                if(cnt<1){
                    res.json({"status":"0"});
                }else{
                    Reservation.find({username:user, date : { $gte: start, $lte: end }},function(err,data){
                        res.json({"status":"1",data:data});
                    });
                }
            });
                
        }else{
             Reservation.count({date : { $gte: start, $lte: end }},function(err,cnt){
                if(cnt<1){
                    res.json({"status":"0"});
                }else{
                    Reservation.find({date : { $gte: start, $lte: end }},function(err,data){
                        res.json({"status":"1",data:data});
                    });
                }
            });
        }
        
    });
   
    app.get('/rezervasyon-sorgula',function(req,res){
        if(req.session.user.auth>0){
            var data = {
                activeUser: req.session.user.username,
                auth:   req.session.user.auth
            };
            res.render('reservation-query-view',{data:data});
        }else res.render('unauthorized');
    });
    
    /* check reservation by date */
    app.post('/check_reservation',function(req,res){
        util.log(req.method + " request to url: " + req.route.path);
            Reservation.count({dateStr : req.body.date, type : req.body.type, user : req.session.user.name},function(err,data){
                if(err) res.json({"status":err});
                else if(data>0) res.json({"status":"1"});
                else{
                    Reservation.count({dateStr:req.body.date,type:req.body.type},function(err,cnt){
                        if(cnt>0) res.json({"status":"0","others":"1"});
                        else res.json({"status":"0","others":"0"});
                    });
                } 
            });
    });
    
    app.post('/check_single_reservation',function(req,res){
        Reservation.count({username:req.body.user,dateStr:req.body.date},function(err,data){
            if(data>0){
                    Reservation.find({username:req.body.user,dateStr: req.body.date},function(err,result){
                        res.json({"status":"1",data:result});    
                    });
            }else{
                    User.findOne({username:req.body.user},function(err,data){
                        res.json({"status":"0",fullname:data.name});
                    });
            }
        });
    });
    
    app.post('/reservations',function(req,res){
        Reservation.find({dateStr:req.body.date,type:req.body.type},function(err,data){
            if(!err) res.json({data:data});
        });
    });
    
    /* handling post request for create new reservation */
    app.post('/reservation/create',function(req,res,next){
        util.log(req.method + " request to url : " + req.route.path);
        var reservationModel = new Reservation();
        reservationModel.dateStr = req.body.dateStr;
        reservationModel.type = req.body.type;
        reservationModel.date = req.body.date;
        if(req.body.user){
             reservationModel.username = req.body.user;
             reservationModel.user  = req.body.fullName;
        }
        else{
            reservationModel.username = req.session.user.username;
            reservationModel.user = req.session.user.name;
        } 
        reservationModel.save(function(err) {
            if(!err) res.json({"status":"ok"});
        });
    });
    
    app.post('/reservation/delete',function(req,res,next){
        util.log(req.method + " request to url : " + req.route.path);
        if(req.body.user){
            if(req.session.user.auth>0){
                util.log("yetki denetimini gecti");
                Reservation.remove({username:req.body.user,dateStr:req.body.date,type:req.body.type},function(err){
                    util.log("sorgunun icinde");
                    if(!err) res.json({"status":"ok"});
                });    
            }else res.json({"status":"error, not authorized request"});
        }else{
            util.log("yetki denetiminde sıçtı");
            Reservation.remove({user:req.session.user.name,dateStr:req.body.date,type:req.body.type},function(err){
                if(!err) res.json({"status":"ok"});
            });    
        }
    });
    
    app.get('/rezervasyon-guncelle',function(req,res){
        if(req.session.user.auth>0){
            var data = {
                activeUser: req.session.user.username,
                auth:   req.session.user.auth
            };
            res.render('reservation-update',{data:data});
        }else res.render('unauthorized');
    });
    
    /* handling post requtest for update reservation */
    app.post('/reservation/update',function(req,res,next){
        
        util.log(req.method + " request to url : " + req.route.path);
        var ID   = req.params('ID'); 
        var date = req.params('date');
        var type = req.params('type');
        var user = req.session.user.username;
        var reservationModel = new Reservation();
        reservationModel.date = date;
        reservationModel.type = type;
        reservationModel.user = user;
        reservationModel.findByIdAndUpdate(ID, { $set: { date: date, type: type }}, function (err, reservation) {
            if (err) return handleError(err);
            res.render('reservation-list',{reservation:reservation});
        });
    
    });
    
}
             
    module.exports = ReservationController;
    