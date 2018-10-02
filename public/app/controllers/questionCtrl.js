angular.module('questionController', ['userServices'])

.controller('questionCtrl', function (user, $timeout, $location) {

    var app = this;
    app.tags = false;

    user.gettags().then(function (data) {
        console.log(data);
        if(data.data.success) {
            console.log('testing');
            app.tags = data.data.tags;
        } else {
            console.log('Tags not found.')
        }
    });
    app.errorMsg = false;
    app.limit = 5;

    user.getallQuestions().then(function (data) {
        if(data.data.success) {
            app.questions = data.data.questions;
        } else {
            app.errorMsg = data.data.message;
        }
    });

    app.addQuestion = function (newQuestionData) {

        app.successMsg = false;
        app.errorMsg = false;
        console.log(newQuestionData);

        user.askQuestion(newQuestionData).then(function (data) {
            console.log(newQuestionData);

            if(data.data.success) {
                app.successMsg = data.data.message + '.Redirecting...';
                $timeout(function () {
                    $location.path('/');
                }, 2000 )
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('readQuestionCtrl', function (user, $routeParams,$timeout) {

    var app = this;

    app.question = false;
    app.author = false;
    app.answers = [];
    app.errorMsg = false;
    app.questionId = false;
    app.answerDiv = false;
    app.disableAnswer = false;
    app.admin = false;
    app.suggesteditsdiv = false;

    function update() {

        user.readQuestion($routeParams.id).then(function (data) {
            if(data.data.success) {
                app.admin = data.data.admin;

                user.updateViews($routeParams.id).then(function (data) {
                    app.question = data.data.question.question;
                    app.author = data.data.question.author;
                    app.answers = data.data.question.answers;
                    app.questionId = $routeParams.id;
                    app.tag = data.data.question.tag;
                });
                //console.log(data.data.admin);
            } else {
                app.errorMsg = data.data.message;
            }
        });

    };

    update();


    app.upvote = function (id,index) {

        upvoteObj = {};
        upvoteObj.id = id;
        upvoteObj.index = index;
        user.upvote(upvoteObj).then(function (data) {
            if(data.data.success) {
                update();
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

    app.downvote = function (id,index) {

        upvoteObj = {};
        upvoteObj.id = id;
        upvoteObj.index = index;
        user.downvote(upvoteObj).then(function (data) {
            if(data.data.success) {
                update();
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

    function allowed() {
        checkObj = {};
        checkObj.id = $routeParams.id;

        user.readQuestion($routeParams.id).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.author = data.data.question.author;

                checkObj.author = app.author;

                user.checkUser(checkObj).then(function (data) {
                    if(data.data.success) {
                        app.disableAnswer = false;
                    } else {
                        app.disableAnswer = true;
                    }
                });
            } else {
                app.errorMsg = data.data.message;
            }
        });
    }

    allowed();

    app.writeAnswer = function () {
        app.answerDiv = true;
    };

    app.addanswer = function (answerData) {

        answerObj = {};
        answerObj.id = $routeParams.id;
        answerObj.answer = app.answerData.answer;
        answerObj.anonymous = app.answerData.anonymous;
        user.addanswer(answerObj).then(function (data) {
            if(data.data.success) {
                update();
                allowed();
                app.answerDiv = false;
                app.answerData = '';
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

    app.deleteAnswer = function (id,index) {

        user.deleteAnswer(id,index).then(function (data) {
            if(data.data.success) {
                update();
                allowed();
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

    app.saveanswer = function (id,index) {
        console.log(id);
        console.log(index);
        saveObj ={};
        saveObj.questionid = id;
        saveObj.answerindex = index;
        app.errorMsg = false;

        user.saveanswer(saveObj).then(function (data) {
            console.log(data);
            if(data.data.success) {
                console.log('Answer saved successfully');
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

    app.edits = function () {
        app.suggesteditsdiv = true;
    };

    app.editSuggest = function (editData) {
        console.log(app.editData);

        user.sendEdit(app.editData).then(function (data) {
            console.log(data);
        });
    };

    app.saythanks = function (username) {
        userObj = {};
        userObj.username = username;
        console.log(username);
        user.saythanks(userObj).then(function (data) {
            console.log(data);
        });
    }
})

.controller('tagCtrl', function (user,$routeParams) {

    var app = this;
    app.errorMsg = false;
    app.questions = false;
    app.tagname = false;

    user.tagPage($routeParams.tagname).then(function (data) {
        if(data.data.success) {
            app.questions = data.data.question;
            app.tagname = $routeParams.tagname;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

.controller('usersprofileCtrl', function (user,$routeParams) {
    // this controller will show the profile page of user at which we click
    var app = this;
    app.errorMsg = false;
    app.username = false;
    app.name = false;
    app.email = false;
    app.permission = false;
    app.follow = false;

    user.checkfollow($routeParams.username).then(function (data) {
        if(data.data.success) {
            user.checkfollowdata($routeParams.username).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.follow = false;
                } else {
                    app.follow = true;
                }
            });
        } else {
            app.follow = true;
        }
    });

    user.getProfile($routeParams.username).then(function (data) {
        if(data.data.success) {
            app.username = data.data.user.username;
            app.email = data.data.user.email;
            app.name = data.data.user.name;
            app.permission = data.data.user.permission;
            app.id = data.data.user._id;
            // more entries to be add

        } else {
            app.errorMsg = data.data.message;
        }
    });

    app.followhim = function () {
        console.log('trying to follow');
        console.log($routeParams.username);
        user.followhim($routeParams.username).then(function (data) {
            console.log(data);
        });
    };

})

.controller('notificationCtrl', function () {
    // yet to build

})

.controller('reportCtrl', function (user) {

    var app = this;
    app.errorMsg = false;
    app.reports = [];

    function report() {


        user.getreport().then(function (data) {
            console.log(data);
            if(data.data.success) {
                console.log('All report requests are here');
                app.reports  = data.data.reports;
                console.log(app.reports);
            } else {
                console.log('err');
                app.errorMsg = data.data.message;
            }
        });

    }


    report();


    app.deleteQuestion = function (id) {
        user.deleteReport(id).then(function (data) {
            if(data.data.success) {
                report();
                console.log('Question deleted successfully.')
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('questionManagementCtrl', function (user) {

    var app = this;

    app.errorMsg = false;
    app.questions = false;
    app.number = 0;

    function getAllQuestions() {
        user.getQuestions().then(function (data) {
            if(data.data.success) {
                app.questions = data.data.questions;
                app.number = data.data.number;
            } else {
                app.errorMsg = data.data.message;
            }
        });

    }

    getAllQuestions();

    app.deleteQuestion = function (id) {
        user.deleteQuestion(id).then(function (data) {
            if(data.data.success) {
                getAllQuestions();
                console.log('Question deleted successfully.')
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('savedAnswerCtrl', function ($routeParams,user) {

    var app = this;

    app.username = $routeParams.username;

    console.log(app.username);
    app.savedanswers = false;
    app.errorMsg = false;

    user.getSavedanswers(app.username).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.savedanswers = data.data.savedArray;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

.controller('questionaskedCtrl', function ($routeParams, user) {
    //console.log($routeParams.username);
    var app = this;

    user.getQuestionsasked($routeParams.username).then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.questions = data.data.questions;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

.controller('answeredCtrl', function () {
    // yet to build

});