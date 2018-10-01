var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    question : {
        type : String,
        unique : true,
        required : true
    },
    answers : [{
        answer : {
            type: String,
        },
        upvote : {
            type : Number
        },
        downvote : {
            type : Number
        },
        views : {
            type : Number
        },
        author : {
            type : String
        },
        comments : [{
            comment : {
                type : String
            },
            author : {
                type : String
            }
        }]
    }],
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
    }
});

module.exports = mongoose.model('Question',questionSchema);