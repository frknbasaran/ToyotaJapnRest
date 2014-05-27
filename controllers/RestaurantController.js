var util        =   require('util');
var Logger      =   require('devnull');
var logger      =   new Logger({namespacing:0});
var Restaurant  =   require('../models/Restaurant');

RestaurantController = function(app,mongoose,config){
    var Restaurant = mongoose.model('Restaurant');
    
    /* Check restaurant status */
    app.get('/restaurant/?',function(req,res,next){
        util.log(req.method + " request to url : " + req.route.path);
        var query = Restaurant.findOne({});
        query.execFind(function(err,restaurant){
            if(!err){
                var data = {
                    activeUser: req.session.user.username,
                    auth:   req.session.user.auth
                };
                res.render('restaurant',{data:data});
            }else{
                  
            }
        });
    });
    
    app.post('/restaurant_check',function(req,res){
        var type = req.body.type;
        var date = req.body.date;
        Restaurant.count({date:date,type:type},function(err,c){
            if(c>0){
                Restaurant.findOne({date:date,type:type},function(err,data){
                    res.json({"result":data.status});
                });
            }else{
                    res.json({"result":"0"});
            }
        });
    });
    
    /* update restaurant status */
    app.post('/restaurant',function(req,res,next){
        util.log(req.method + " request to url : " + req.route.path);
        var date = req.body.date;
        var type = req.body.type;
        var status = req.body.status;
        restaurant = new Restaurant();
        Restaurant.count({date:date,type:type},function(err,c){
            if(!err){
                if(c<1){
                    restaurant.date = req.body.date;
                    restaurant.status = req.body.status;
                    restaurant.type = req.body.type;
                    restaurant.save(function(err){
                        if(!err) res.json({"status":"ok"});
                        else res.json({"status":"error"});
                    });            
                }else{
                    Restaurant.findOne({date:date,type:type},function(err,data){
                        Restaurant.findByIdAndUpdate(data._id,{status:status},function(err){
                            if(!err) res.json({"status":"ok"});
                            else res.json({"status":"error"});    
                        });
                    });
                }
            }
        });
    });
    
}

module.exports = RestaurantController;