var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({

    id : {
        type : String,
        required : true,
        unique : true
    },
    question : {
        type: String,
        required: true
    },
    author : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Report',reportSchema);