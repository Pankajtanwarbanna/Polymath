var mongoose = require('mongoose');

var guideSchema = new mongoose.Schema({

    heading : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    tag : {
        type : String,
        required : true
    },
    link : {
        type : String,
        required : true
    },
    level : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model('Guide',guideSchema);