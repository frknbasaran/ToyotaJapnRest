module.exports = function(mongoose){
    var validator = require('../lib/validator'),
        Schema    = mongoose.Schema,
        util      = require('util'),
        config    = require('config'),
        User;
    
        User = new Schema({
            name: {
                type: String,
                required: false,
                default: ""
            },
            lastname: {
                type: String,
                required: false,
                default: ""
            },
            username: {
                type: String,
                validate: [validator({length:{min:3,max:20}}),"username"],
                required: false,
                default: ""
            },
            password: {
                type: String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            registerDate: {
                type: Date,
                default: Date.now
            },
            loginDate: {
                type: Date,
                required:false
            },
            auth: {
                type: Number,
                required:false,
                default : 0
            }
        });
    return mongoose.model('User',User);
}