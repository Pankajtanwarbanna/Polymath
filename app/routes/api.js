var User = require('../models/user');
var Question = require('../models/quetionAnswer');
var Tag = require('../models/tag');
var Report = require('../models/report');
var jwt = require('jsonwebtoken');
var secret = 'polymath';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function (router){

    // Nodemailer-sandgrid stuff
    var options = {
        auth: {
            api_key: 'YOUR_API_KEY'
        }
    };

    var client = nodemailer.createTransport(sgTransport(options));

    // User register API
    router.post('/register',function (req, res) {
        var user = new User();

        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.temporarytoken = jwt.sign({ email : user.email , username : user.username }, secret , { expiresIn : '24h' });

        //console.log(req.body);
        if(!user.name || !user.email || !user.password || !user.username) {
            res.json({
                success : false,
                message : 'Ensure you filled all entries!'
            });
        } else {
            user.save(function(err) {
                if(err) {
                    if(err.errors != null) {
                        // validation errors
                        if(err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.email) {
                            res.json({
                                success : false,
                                message : err.errors.email.message
                            });
                        } else if(err.errors.password) {
                            res.json({
                                success : false,
                                message : err.errors.password.message
                            });
                        } else {
                            res.json({
                                success : false,
                                message : err
                            });
                        }
                    } else {
                        // duplication errors
                        if(err.code === 11000) {
                            //console.log(err.errmsg);
                            if(err.errmsg[57] === 'e') {
                                res.json({
                                    success: false,
                                    message: 'Email is already registered.'
                                });
                            } else if(err.errmsg[57] === 'u') {
                                res.json({
                                    success : false,
                                    message : 'Username is already registered.'
                                });
                            } else {
                                res.json({
                                    success : false,
                                    message : err
                                });
                            }
                        } else {
                            res.json({
                                success: false,
                                message: err
                            })
                        }
                    }
                } else {

                    var email = {
                        from: 'Polymath Registration, support@polymath.com',
                        to: user.email,
                        subject: 'Activation Link - Polymath Registration',
                        text: 'Hello '+ user.name + 'Thank you for registering with us.Please find the below activation link Activation link Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>Thank you for registering with us.Please find the below activation link<br><br><a href="http://localhost:8080/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });


                    res.json({
                        success : true,
                        message : 'Account registered! Please check your E-mail inbox for the activation link.'
                    });
                }
            });
        }
    });

    // User login API
    router.post('/authenticate', function (req,res) {

        if(!req.body.username || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you fill all the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('email username password active').exec(function (err, user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found. Please Signup!'
                    });
                } else if(user) {

                    if(!user.active) {
                        res.json({
                            success : false,
                            message : 'Account is not activated yet.Please check your email for activation link.',
                            expired : true
                        });
                    } else {

                        var validPassword = user.comparePassword(req.body.password);

                        if (validPassword) {
                            var token = jwt.sign({
                                email: user.email,
                                username: user.username
                            }, secret, {expiresIn: '24h'});
                            res.json({
                                success: true,
                                message: 'User authenticated.',
                                token: token
                            });
                        } else {
                            res.json({
                                success: false,
                                message: 'Incorrect password. Please try again.'
                            });
                        }
                    }
                }
            });
        }

    });

    router.put('/activate/:token', function (req,res) {

        if(!req.params.token) {
            res.json({
                success : false,
                message : 'No token provided.'
            });
        } else {

            User.findOne({temporarytoken: req.params.token}, function (err, user) {
                if (err) throw err;

                var token = req.params.token;

                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Activation link has been expired.'
                        })
                    }
                    else if (!user) {
                        res.json({
                            success: false,
                            message: 'Activation link has been expired.'
                        });
                    } else {

                        user.temporarytoken = false;
                        user.active = true;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {

                                var email = {
                                    from: 'Polymath Registration, support@polymath.com',
                                    to: user.email,
                                    subject: 'Activation activated',
                                    text: 'Hello ' + user.name + 'Your account has been activated.Thank you Pankaj Tanwar CEO, Polymath',
                                    html: 'Hello <strong>' + user.name + '</strong>,<br><br> Your account has been activated.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                                };

                                client.sendMail(email, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });

                                res.json({
                                    success: true,
                                    message: 'Account activated.'
                                })

                            }
                        });
                    }
                });
            })
        }
    });

    // Resend activation link
    router.post('/resend', function (req,res) {

        if(!req.body.username || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you fill all the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('name username email password active temporarytoken').exec(function (err,user) {

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User is not registered with us.Please signup!'
                    });
                } else {
                    if(user.active) {
                        res.json({
                            success : false,
                            message : 'Account is already activated.'
                        });
                    } else {

                        var validPassword = user.comparePassword(req.body.password);

                        if(!validPassword) {
                            res.json({
                                success : false,
                                message : 'Incorrect password.'
                            });
                        } else {
                            res.json({
                                success : true,
                                user : user
                            });

                        }
                    }
                }
            })
        }
    });

    // router to update temporary token in the database
    router.put('/sendlink', function (req,res) {

        User.findOne({username : req.body.username}).select('email username name temporarytoken').exec(function (err,user) {
            if (err) throw err;

            user.temporarytoken = jwt.sign({
                email: user.email,
                username: user.username
            }, secret, {expiresIn: '24h'});

            user.save(function (err) {
                if(err) {
                    console.log(err);
                } else {

                    var email = {
                        from: 'Polymath Registration, support@polymath.com',
                        to: user.email,
                        subject: 'Activation Link request - Polymath Registration',
                        text: 'Hello '+ user.name + 'You requested for the new activation link.Please find the below activation link Activation link Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the new activation link.Please find the below activation link<br><br><a href="http://localhost:8080/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({
                        success : true,
                        message : 'Link has been successfully sent to registered email.'
                    });

                }
            })
        });


    });

    // Forgot username route
    router.post('/forgotUsername', function (req,res) {

        if(!req.body.email) {
            res.json({
                success : false,
                message : 'Please ensure you fill all the entries.'
            });
        } else {
            User.findOne({email : req.body.email}).select('username email name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Email is not registered with us.'
                    });
                } else if(user) {

                    var email = {
                        from: 'Polymath, support@polymath.com',
                        to: user.email,
                        subject: 'Forgot Username Request',
                        text: 'Hello '+ user.name + 'You requested for your username.You username is ' + user.username + 'Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for your username.You username is <strong>'+ user.username + '</strong><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({
                        success : true,
                        message : 'Username has been successfully sent to your email.'
                    });
                } else {
                    res.send(user);
                }

            });
        }

    });

    // Send link to email id for reset password
    router.put('/forgotPasswordLink', function (req,res) {

        if(!req.body.username) {
            res.json({
                success : false,
                message : 'Please ensure you filled the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('username email temporarytoken name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Username not found.'
                    });
                } else {

                    console.log(user.temporarytoken);

                    user.temporarytoken = jwt.sign({
                        email: user.email,
                        username: user.username
                    }, secret, {expiresIn: '24h'});

                    console.log(user.temporarytoken);

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error accured! Please try again. '
                            })
                        } else {

                            var email = {
                                from: 'Polymath Registration, support@polymath.com',
                                to: user.email,
                                subject: 'Forgot Password Request',
                                text: 'Hello '+ user.name + 'You request for the forgot password.Please find the below link Reset password Thank you Pankaj Tanwar CEO, Polymath',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the forgot password. Please find the below link<br><br><a href="http://localhost:8080/forgotPassword/'+ user.temporarytoken+'">Reset password</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                            };

                            client.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

                            res.json({
                                success : true,
                                message : 'Link to reset your password has been sent to your registered email.'
                            });

                        }
                    });

                }

            })

        }
    });

    // router to change password
    router.post('/forgotPassword/:token', function (req,res) {

        if(!req.params.token) {
            res.json({
                success : false,
                message : 'No token provied.'
            });
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('username temporarytoken').exec(function (err,user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Link has been expired.'
                    });
                } else {
                    res.json({
                        success : true,
                        user : user
                    });
                }
            });
        }
    });

    // route to reset password
    router.put('/resetPassword/:token', function (req,res) {

        console.log('api is working fine');

        if(!req.body.password) {
            res.json({
                success : false,
                message : 'New password is missing.'
            })
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('name password').exec(function (err,user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Link has been expired.'
                    })
                } else {

                    user.password = req.body.password;
                    user.temporarytoken = false;

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Password must have one lowercase, one uppercase, one special character, one number and minimum 8 and maximum 25 character.'
                            });
                        } else {

                            var email = {
                                from: 'Polymath, support@polymath.com',
                                to: user.email,
                                subject: 'Password reset',
                                text: 'Hello '+ user.name + 'You request for the reset password.Your password has been reset. Thank you Pankaj Tanwar CEO, Polymath',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the reset password. Your password has been reset.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                            };

                            client.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

                            res.json({
                                success : true,
                                message : 'Password has been changed successfully.'
                            })

                        }
                    })
                }
            })
        }
    });

    // Middleware to verify token
    router.use(function (req,res,next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            // verify token
            jwt.verify(token, secret, function (err,decoded) {
                if (err) {
                    res.json({
                        success : false,
                        message : 'Token invalid.'
                    })
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            res.json({
                success : false,
                message : 'No token provided.'
            });
        }
    });

    // API User profile
    router.post('/me', function (req,res) {

        //console.log(req.decoded.email);
        // getting profile of user from database using email, saved in the token in localStorage
        User.findOne({ email : req.decoded.email }).select('email username name').exec(function (err, user) {
            if(err) throw err;

            if(!user) {
                res.status(500).send('User not found.');
            } else {
                res.send(user);
            }
        });
    });

    // get permission of user
    router.get('/permission', function (req,res) {

        User.findOne({ username : req.decoded.username }).select('permission').exec(function (err,user) {

            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                })
            } else {
                res.json({
                    success : true,
                    permission : user.permission
                })
            }
        })
    });

    // get all users
    router.get('/management', function (req, res) {

        User.find({}, function (err, users) {

            if(err) throw err;
            User.findOne({ username : req.decoded.username }, function (err,mainUser) {

                if(err) throw err;
                if(!mainUser) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    if(!users) {
                        res.json({
                            success : false,
                            message : 'Users not found.'
                        });
                    } else {
                        res.json({
                            success : true,
                            users : users,
                            permission : mainUser.permission
                        })
                    }
                }
            })
        })
    });

    // delete a user form database
    router.delete('/management/:username', function (req,res) {

        var deletedUser = req.params.username;

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {

            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                if(mainUser.permission !== 'admin') {
                    res.json({
                        success : false,
                        message : 'Insufficient permission'
                    });
                } else {
                    User.findOneAndRemove({ username : deletedUser }, function (err,user) {
                        if(err) throw err;

                        res.json({
                            success : true,
                        });
                    });
                }
            }
        })
    });

    // route to edit user
    router.get('/edit/:id', function (req,res) {
        var editedUser = req.params.id;

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found...'
                });
            } else {
                if(mainUser.permission === 'admin') {

                    User.findOne({ _id : editedUser }, function (err, user) {

                        if(err) throw err;

                        if(!user) {
                            res.json({
                                success : false,
                                message : 'User not found.'
                            });
                        } else {
                            res.json({
                                success : true,
                                user : user
                            })
                        }

                    })

                } else {
                    res.json({
                        success : false,
                        message : 'Insufficient permission.'
                    })
                }
            }
        })
    });

    // update user details
    router.put('/edit', function (req,res) {

        var editedUser = req.body._id;

        if(req.body.name) {
            var newName = req.body.name;
        }
        if(req.body.username) {
            var newUsername = req.body.username;
        }
        if(req.body.email) {
            var newEmail = req.body.email;
        }
        if(req.body.permission) {
            var newPermission = req.body.permission;
        }

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found'
                });
            } else {
                if(mainUser.permission === 'admin') {

                    // update name
                    if(newName) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                user.name = newName;
                                user.save(function (err) {
                                    if(err) {
                                        if(err.errors.name) {
                                            res.json({
                                                success : false,
                                                message : err.errors.name.message
                                            })
                                        } else {
                                            res.json({
                                                success : false,
                                                message : 'Error! Please try again.'
                                            })
                                        }
                                    }

                                    else {

                                        res.json({
                                            success : true,
                                            message : 'Name has been updated.'
                                        });
                                    }

                                })
                            }

                        })
                    }

                    // update username
                    if(newUsername) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                user.username = newUsername;
                                user.save(function (err) {
                                    if(err) {
                                        if(err.errors) {
                                            res.json({
                                                success : false,
                                                message : err.errors.username.message
                                            })
                                        } else {
                                            res.json({
                                                success : false,
                                                message : 'Username is not unique.'
                                            })
                                        }
                                    }

                                    res.json({
                                        success : true,
                                        message : 'Username has been updated.'
                                    })
                                })
                            }

                        })
                    }

                    // update email
                    if(newEmail) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                user.email = newEmail;
                                user.save(function (err) {
                                    if(err) {
                                        if(err.errors) {
                                            console.log(err.errors);
                                            res.json({
                                                success : false,
                                                message : err.errors.email.message
                                            })
                                        } else {
                                            res.json({
                                                success : false,
                                                message : 'User is already registered with us.'
                                            })
                                        }
                                    } else {
                                        res.json({
                                            success : true,
                                            message : 'Email has been updated.'
                                        });
                                    }

                                })
                            }

                        })
                    }

                    // update permission
                    if(newPermission) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                console.log(user.permission);
                                console.log(mainUser.permission);

                                if(user.permission === 'user' && mainUser.permission === 'admin') {
                                    user.permission = 'admin';

                                    user.save(function (err) {
                                        if(err) {
                                            res.json({
                                                success : false,
                                                message : 'Can not upgrade to admin'
                                            });
                                        } else {
                                            res.json({
                                                success : true,
                                                message : 'Successfully upgraded to admin.'
                                            })
                                        }
                                    });

                                } else if(user.permission === 'user' && mainUser.permission === 'user') {
                                    res.json({
                                        success : false,
                                        message : 'Insufficient permission.'
                                    })
                                } else if(user.permission === 'admin' && mainUser.permission === 'admin') {
                                    res.json({
                                        success : false,
                                        message : 'Role is already admin.'
                                    })
                                } else if (user.permission === 'admin' && mainUser.permission === 'user') {
                                    res.json({
                                        success : false,
                                        message : 'Insufficient permission.'
                                    })
                                } else {
                                    res.json({
                                        success : true,
                                        message : 'Please try again later.'
                                    })
                                }
                            }

                        });
                    }


                } else {
                    res.json({
                        success : false,
                        message : 'Insufficient permission.'
                    })
                }
            }
        });
    });

    // ask question to users
    router.post('/askQuestion', function (req,res) {

        console.log(req.body);

        var askQuestion = new Question();

        askQuestion.question = req.body.newQuestion;
        askQuestion.tag = req.body.tag;
        if(req.body.anonymous === 'yes') {
            askQuestion.author = 'anonymous';
        } else {
            askQuestion.author = req.decoded.username;
        }

        askQuestion.save(function (err) {

            if(err) {
                console.log(err);
                res.json({
                    success : false,
                    message : 'Please select a category.'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Question successfully saved to database.'
                })
            }
        });

    });

    // route to get all the questions
    router.get('/questions', function (req,res) {

        User.findOne( { username : req.decoded.username }, function (err, user) {
            if(err) {
                throw err;
            }

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {


                Question.find({}, function (err,questions) {

                    if(err) {
                        res.json({
                            success : false,
                            message : 'Error in loading questions form database side.'
                        })
                    } else {

                        totalanswers = [];

                        for(var i=0;i<questions.length;i++) {
                            totalanswers.push(questions[i].answers.length);
                        }
                        if(user.permission === 'admin') {

                            res.json({
                                success : true,
                                questions : questions,
                                totalanswers : totalanswers,
                                admin : true,
                                number : totalanswers.length
                            });

                        } else {
                            res.json({
                                success: true,
                                questions: questions,
                                totalanswers: totalanswers,
                                admin: false,
                                number : totalanswers.length
                            });
                        }
                    }
                });


            }

        });
    });

    // route to get question
    router.get('/readquestion/:id', function (req,res) {

        User.findOne({ username : req.decoded.username }, function (err, mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {

                Question.findOne({ _id : req.params.id }, function (err, question) {
                    if(err) throw err;

                    if(!question) {
                        res.json({
                            success : false,
                            message : 'Question not found.'
                        });
                    } else {

                        if(mainUser.permission === 'admin') {
                            res.json({
                                success : true,
                                question : question,
                                admin : true
                            });
                        } else {
                            res.json({
                                success : true,
                                question : question,
                                admin : false
                            });
                        }
                    }
                });

            }
        });
    });

    // router to update views
    router.put('/updateViews/:id', function (req,res) {
        console.log(req.params.id);

        Question.findOne({ _id : req.params.id}, function (err, question) {
            if(err) throw err;

            if(!question) {
                res.json({
                    success : false,
                    message : 'Question not found.'
                });
            } else {
                console.log(question);
                console.log(question.answers);
                if(question.answers.length === 0) {
                    question.totalviews = question.totalviews + 1;
                } else {
                    question.totalviews = question.totalviews + question.answers.length;
                }

                for(var i=0;i<question.answers.length;i++) {
                    question.answers[i].views++;
                }

                question.save(function (err) {
                    if(err) {
                        res.json({
                            success : false,
                            message : 'Error in saving the question.'
                        });
                    } else {
                        res.json({
                            success : true,
                            question : question,
                            answers : question.answers.length
                        })
                    }
                })
            }
        })
    })

    // route to get page according to tag
    router.get('/tag/:tagname', function (req,res) {

        Question.find({ tag : req.params.tagname }, function (err, question) {

            if(err) {
                throw err;
            }
            if(!question) {
                res.json({
                    success : false,
                    message : 'No question found.'
                });
            } else {
                res.json({
                    success : true,
                    question : question
                });
            }
        });
    });

    // upvote an answer
    router.put('/upvote', function (req,res) {

        var id = req.body.id;
        var index = req.body.index + 1;

        if(!id || !index) {
            res.json({
                success : false,
                message : 'Entries are missing.'
            });
        } else {
            Question.findOne({ _id : req.body.id }, function (err, question) {
                if(err) {
                    throw err;
                }

                if(!question) {
                    res.json({
                        success : false,
                        message : 'Answer not found.'
                    });
                } else {
                    console.log(question.answers[index-1].upvote);
                    question.answers[index-1].upvote++;
                    question.totallikes++;
                    question.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error in upvoting answer.'
                            });
                        } else {
                            res.json({
                                success : true,
                                upvote : question.answers[index-1].upvote
                            });
                        }
                    })
                }
            })
        }
    });

    // downvote a answer
    router.put('/downvote', function (req,res) {

        var id = req.body.id;
        var index = req.body.index + 1;

        if(!id || !index) {
            res.json({
                success : false,
                message : 'Entries are missing.'
            });
        } else {
            Question.findOne({ _id : req.body.id }, function (err, question) {
                if(err) {
                    throw err;
                }

                if(!question) {
                    res.json({
                        success : false,
                        message : 'Answer not found.'
                    });
                } else {
                    //console.log(question.answers[index-1].downvote);
                    question.answers[index-1].downvote++;
                    question.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error in downvoting answer.'
                            });
                        } else {
                            res.json({
                                success : true,
                                downvote : question.answers[index-1].downvote
                            });
                        }
                    })
                }
            })
        }
    });

    // router to check user is allowed to add answer or not
    router.post('/checkUser', function (req,res) {
        console.log(req.body);
        if(!req.body.id || !req.body.author) {
            res.json({
                success : false,
                message : 'Entries are missing.'
            });
        } else {
            Question.findOne({ _id : req.body.id }, function (err, question) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error.....'
                    });
                }

                if(!question) {
                    res.json({
                        success : false,
                        message : 'Question not found.'
                    })
                } else {
                    var flag = 1;
                    for(var i=0;i < question.answers.length;i++) {
                        if(question.answers[i].author === req.body.author) {
                            res.json({
                                success : false,
                                message : 'User already answered.'
                            });
                            flag = 2;
                            break;
                        }
                    }
                    if(flag === 1){
                        res.json({
                            success : true
                        })
                    }
                }
            })
        }
    });

    // add answer to question
    router.put('/addanswer', function (req,res) {

        if(!req.body.id || !req.body.answer) {
            res.json({
                success : false,
                message : 'Entries are missing.'
            });
        } else {
            Question.findOne({ _id : req.body.id }, function (err, question) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error ! please try again.'
                    });
                }

                if(!question) {
                    res.json({
                        success : true,
                        message : 'No question found.'
                    })
                } else {
                    //console.log(question);

                    answerObj = {};
                    answerObj.answer = req.body.answer;
                    if(req.body.anonymous === 'yes') {
                        answerObj.author = 'anonymous';
                    } else {
                        answerObj.author = req.decoded.username;
                    }

                    answerObj.upvote = 0;
                    answerObj.downvote = 0;
                    answerObj.views = 0;

                    //console.log(question.answers.length);

                    question.answers.push(answerObj);

                    //console.log(answerObj);

                    //console.log(question);

                    question.save(function (err) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'Error in saving answer.'
                            });
                        } else {
                            res.json({
                                success: true
                            })
                        }
                    })
                }
            })
        }
    });

    // get users profile
    router.get('/getprofile/:username', function (req, res) {
        if(!req.params.username) {
            res.json({
                success : false,
                message : 'Entries missing.'
            });
        } else {

            User.findOne({ username : req.params.username} , function (err, user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'No user found.'
                    });
                } else {
                    res.json({
                        success : true,
                        user : user
                    })
                }
            })
        }
    });


    // router to get all questions
    router.get('/questionManagement', function (req, res) {

        Question.find({}, function (err, questions) {

            if(err) throw err;
            User.findOne({ username : req.decoded.username }, function (err,mainUser) {

                if(err) throw err;
                if(!mainUser) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    if(mainUser.permission === 'admin') {
                        if(!questions) {
                            res.json({
                                success : false,
                                message : 'Users not found.'
                            });
                        } else {
                            res.json({
                                success : true,
                                questions : questions,
                                permission : mainUser.permission,
                                number : questions.length
                            });
                        }
                    } else {
                        res.json({
                            success : false,
                            message : 'Insufficient permission.',
                            number : questions.length
                        });
                    }
                }
            })
        })

    });


    // delete a question form database
    router.delete('/questionManagement/:id', function (req,res) {

        var deletedUser = req.params.id;

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {

            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                if(mainUser.permission !== 'admin') {
                    res.json({
                        success : false,
                        message : 'Insufficient permission'
                    });
                } else {
                    Question.findOneAndRemove({ _id : deletedUser }, function (err,question) {
                        if(err) throw err;

                        if(!question) {
                            res.json({
                                success : false,
                                message : 'Question not found.'
                            })
                        } else {
                            res.json({
                                success : true,
                            });
                        }
                    });
                }
            }
        })
    });

    // router to delete answer
    router.delete('/deleteAnswer/:id/:index', function (req,res) {

        if(!req.params.id || !req.params.index) {
            res.json({
                success : false,
                message : 'Entries are missing.'
            });
        } else {

            User.findOne({ username : req.decoded.username }, function (err, mainUser) {
                if(err) throw err;

                if(!mainUser) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(mainUser.permission === 'admin') {

                        Question.findOne({ _id : req.params.id }, function (err, question) {

                            if(err) throw err;

                            if(!question) {
                                res.json({
                                    success : false,
                                    message : 'Question not found.'
                                })
                            } else {
                                question.answers.splice(req.params.index, 1);

                                question.save(function (err) {
                                    if(err) {
                                        res.json({
                                            success : true,
                                            message : 'Error in deleting answer.'
                                        })
                                    } else {
                                        res.json({
                                            success : true
                                        });
                                    }
                                })
                            }
                        });
                    } else {
                        res.json({
                            success : false,
                            message : 'Insufficient Permission.'
                        })
                    }
                }
            });
        }
    });



    // route to save answer
    router.post('/saveanswer', function (req,res) {

        User.findOne({ username : req.decoded.username }, function (err, mainUser) {

            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                saveObj = {};

                Question.findOne({ _id : req.body.questionid } , function (err,question) {
                    if(err) throw err;
                    if(!question) {
                        res.json({
                            success : false,
                            message : 'Question not found.'
                        })
                    } else {

                        console.log(question);

                        saveObj.question = question.question;
                        saveObj.answer = question.answers[req.body.answerindex].answer;
                        saveObj.author = question.answers[req.body.answerindex].author;

                        mainUser.savedanswer.push(saveObj);

                        mainUser.save(function (err) {
                            if(err) {
                                throw err;
                            } else {
                                res.json({
                                    success : true
                                })
                            }
                        });

                    }
                })

            }
        })
    });

    // router to get saved answers
    router.get('/getSavedanswers', function (req,res) {


        User.findOne({ username : req.decoded.username }, function (err,user) {
            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {

                savedArray = [];

                //console.log(user);

                res.json({
                    success : true,
                    savedArray : user.savedanswer
                })
            }
        });
    });

    // get all tags from database
    router.get('/gettags', function (req,res) {

        User.findOne({ username : req.decoded.username }, function (err,user) {
            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {

                    Tag.find({  }, function (err,tags) {
                        if(err) throw err;

                        if(!tags) {
                            res.json({
                                success : false,
                                message : 'Tags not found.'
                            });
                        } else {
                            res.json({
                                success : true,
                                tags : tags
                            })
                        }
                    });

            }
        })
    });

    // router to add tags
    router.post('/addtag', function (req, res) {
        console.log(req.body);

        if(!req.body.tag) {
            res.json({
                success : false,
                message : 'Entries are missing'
            })
        } else {

            var tag = new Tag();

            tag.tag = req.body.tag;

            tag.save(function (err) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Tag is already saved.'
                    })
                } else {
                    res.json({
                        success : true,
                        message : 'Tag saved.'
                    })
                }
            })

        }

    });

    // delete tag
    router.delete('/deletetag/:tag', function (req,res) {
        console.log(req.params.tag);

        Tag.findOneAndRemove({ tag: req.params.tag }, function (err, tag) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error while removing tag.'
                });
            } else {
                res.json({
                    success : true,
                    message : 'Tag deleted successfully.'
                })
            }
        })
    });

    // report a question
    router.post('/report', function (req,res) {

        var report = new Report();
        report.id = req.body._id;
        report.question = req.body.question;
        report.author = req.body.author;

        report.save(function (err) {
            if(err) {
                console.log(err);
                res.json({
                    success : false,
                    message : 'Question already reported.'
                });
            } else {
                res.json({
                    success : true,
                    message : 'Reported successfully.'
                });
            }
        });
    });

    // route to get all report request
    router.get('/getreport', function (req,res) {

        User.findOne({ username : req.decoded.username }, function (err, user) {
            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                })
            } else {
                if(user.permission === 'admin') {

                    Report.find({ }, function (err, reports) {
                        if(err) {
                            throw err;
                        } else {
                            res.json({
                                success : true,
                                reports : reports
                            });
                        }
                    })

                } else {
                    res.json({
                        success : false,
                        message : 'Insufficient permission'
                    });
                }
            }
        })

    });

    // router to delete report
    router.delete('/report/:id', function (req,res) {

        console.log(req.params.id);

        Report.findOneAndRemove({ id :req.params.id }, function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error please try again'
                });
            } else {
                res.json({
                    success : true,
                    message : 'Deleted successfully.'
                })
            }
        });
    });

    // router to check follow
    router.post('/checkfollow/:id', function (req,res) {

        console.log(req.params.id);

        User.findOne({ username : req.decoded.username }, function (err, mainUser) {
            if(err) {
                throw err;
            }

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                if(req.decoded.username === req.params.id) {
                    res.json({
                        success : false
                    })
                } else {
                    res.json({
                        success : true
                    })
                }
            }
        })

    });

    // check follow database
    router.post('/checkfollowdata/:username', function (req,res) {

        console.log(req.params.username);

        User.findOne({ username : req.params.username }, function (err , user) {
            if(err) {
                throw err;
            }

            if(!user) {
                res.json({
                    success : false,
                    message : 'user not found.'
                })
            } else {
                var flag = 1;
                for(var i=0;i< user.followers.length;i++) {
                    if(user.followers[i] === req.decoded.username ) {
                        flag = 2;
                        res.json({
                            success : false
                        });
                        break;
                    }
                }

                if(flag === 1) {

                    res.json({
                        success : true,
                        message : 'You can follow him.'
                    })

                }
            }
        })

    });


    // router to following
    router.post('/followhim/:username', function (req,res) {
        console.log(req.params.username);

        User.findOne({ username : req.decoded.username }, function (err, mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                User.findOne({ username : req.params.username }, function (err,user) {
                    if(err) {
                        throw err;
                    }

                    if(!user) {
                        res.json({
                            success : false,
                            message : 'No user found.'
                        });
                    } else {

                        followObj = {};
                        followObj.username = req.decoded.username;

                        followingObj = {};
                        followingObj.username = user.username;

                        user.followers.push(followObj);
                        mainUser.following.push(followingObj);

                        user.save(function (err) {
                            if(err) {
                                res.json({
                                    success : false
                                });
                            } else {
                                mainUser.save(function (err) {
                                    if(err) {
                                        res.json({
                                            success : false,
                                        });
                                    } else {
                                        res.json({
                                            success : true
                                        });
                                    }
                                })
                            }
                        });
                    }
                })

            }
        });

    });

    // router to get followers
    router.get('/followers/:username', function (req,res) {

        User.findOne({ username : req.params.username }, function (err,user) {
            if(err) {
                throw err;
            }
            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                res.json({
                    success : true,
                    followers : user.followers
                })
            }
        })

    });

    // router to get following
    router.get('/following/:username', function (req,res) {

        User.findOne({ username : req.params.username }, function (err,user) {
            if(err) {
                throw err;
            }
            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                res.json({
                    success : true,
                    following : user.following
                });
            }
        })

    });

    // send edits
    router.post('/sendEdit', function (req,res) {
        console.log(req.body);

        console.log(req.decoded.email);

        var email = {
            from: 'Polymath, support@polymath.com',
            to: user.email,
            subject: 'Suggested Edits',
            text: 'Hello '+ req.decoded.name + 'Thank you Pankaj Tanwar CEO, Polymath',
            html: 'Hello <strong>'+ req.decoded.name + '</strong>,<br>You have got some edits on your answers :<br> '+ req.body +'<br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
        };

        client.sendMail(email, function(err, info){
            if (err ){
                console.log(err);
            }
            else {
                console.log('Message sent: ' + info.response);
            }
        });


        res.json({
            success : true,
            message : 'Account registered! Please check your E-mail inbox for the activation link.'
        });

    });

    // say thanks route
    router.post('/saythanks', function (req,res) {
        console.log(req.body.username);

        var email = {
            from: 'Polymath, support@polymath.com',
            to: req.decoded.email,
            subject: 'Thank you',
            text: 'Hello '+ req.body.username + 'Thank you Pankaj Tanwar CEO, Polymath',
            html: 'Hello <strong>'+ req.body.username + '</strong>,<br> '+ req.decoded.username +' wants to say a special thanks to you for your answers.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
        };

        client.sendMail(email, function(err, info){
            if (err ){
                console.log(err);
            }
            else {
                console.log('Message sent: ' + info.response);
            }
        });


        res.json({
            success : true,
            message : 'Account registered! Please check your E-mail inbox for the activation link.'
        });
    });

    // get questions
    router.get('/getQuestionsasked/:username', function (req,res) {
        console.log(req.params.username);
        Question.find({ author : req.params.username} , function (err, questions) {
            if(err) {
                throw err;
            }

            if(!questions) {
                res.json({
                    success : true,
                    message : 'No question found.'
                });
            } else {
                res.json({
                    questions : questions,
                    success : true
                })
            }
        })
    });

    return router;
};

