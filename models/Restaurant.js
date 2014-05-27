module.exports = function (mongoose) {
    var validator = require('../lib/validator'),
            Schema = mongoose.Schema,
            util = require('util'),
            config = require('config'),
            Restaurant;
    
    Restaurant = new Schema({
        status: {
            type: String,
            required: false
        },
        type: {
            type: Number,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    });
    
    return mongoose.model('Restaurant',Restaurant);
}