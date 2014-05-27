module.exports = function (mongoose) {
    var validator = require('../lib/validator'),
            Schema = mongoose.Schema,
            util = require('util'),
            config = require('config'),
            Reservation;
    
    Reservation = new Schema({
        user: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        dateStr: {
            type: String,
            required: true
        },
        date: {
            type: Date
        },
        type: {
            type: String,
            required : true
        },
        createdAt: {
            type: Date,
            required:false,
            default: Date.now
        }
    });
    
    return mongoose.model('Reservation',Reservation);
}