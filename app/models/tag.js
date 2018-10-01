var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({

    tag : {
        type : String,
        required : true,
        unique : true
    }
});

module.exports = mongoose.model('Tag',tagSchema);