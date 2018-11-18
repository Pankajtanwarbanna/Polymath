var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
mongoose.set('useCreateIndex', true);

// Backend mongoose validators
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,10})+[ ]+([a-zA-Z]{3,10})+)+$/,
        message : 'Name must have minimum 3 and maximum 20 character, Space in between the name, No special letters or numbers!'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message : 'Please type a valid email.'
    }),
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).{8,25}$/,
        message : 'Password must have one lowercase, one uppercase, one special character, one number and minimum 8 and maximum 25 character'
    }),
    validate({
        validator: 'isLength',
        arguments: [8,25],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        validate: nameValidator
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        validate : emailValidator
    },
    password : {
        type : String,
        required : true,
        validate : passwordValidator,
        select : false
    },
    active : {
        type : Boolean,
        required : true,
        default : false
    },
    temporarytoken : {
        type : String,
        required : true
    },
    permission : {
        type : String,
        required : true,
        default: 'user'
    },
    savedanswer : [{
        question : {
            type : String
        },
        answer : {
            type : String
        },
        author : {
            type : String
        }
    }],
    followers : [{
        username : {
            type : String,
            unique : true
        }
    }],
    following : [{
        username : {
            type : String,
            unique : true
        }
    }],
    codinghandle : [{
        codechef : {
            type : String,
        },
        codeforces : {
            type : String,
        },
        hackerrank : {
            type : String,
        },
        hackerearth : {
            type : String,
        },
        github : {
            type : String,
        }
    }],
    level : {
        type : Number,
        required : true,
        default: 0
    },
    profilepicurl : {
        type : String
    }
});

userSchema.pre('save', function (next) {

    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if(err) {
            return next(err);
            //res.send('Error in hashing password');
        } else {
            user.password = hash;
            next();
        }
    });
});

// Mongoose title case plugin
userSchema.plugin(titlize, {
    paths: [ 'name' , 'location'], // Array of paths
});

// Password compare method
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);