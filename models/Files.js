module.exports = function(mongoose){
    var validator = require('../lib/validator'),
        Schema    = mongoose.Schema,
        util      = require('util'),
        config    = require('config'),
        Files;
    
        Files = new Schema({
            name: {
                type: String
            },
            uploader: {
                type: String
            },
            type: {
                type: Number
            },
            date: {
                type: Date,
                default: Date.now
            }
        });
    
    return mongoose.model('Files',Files);
}