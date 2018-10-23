var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    topic : {
        type : String,
        unique : true,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required: true
    },
    tag : {
        type : String,
        required : true,
        default : 'Other'
    },
    totalviews : {
        type : Number,
        default: 0
    },
    totallikes : {
        type : Number,
        default : 0
    },
    approved : {
        type : String,
        default : false
    }
});

module.exports = mongoose.model('Article',articleSchema);