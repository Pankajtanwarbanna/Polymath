angular.module('questionController', ['userServices'])

.controller('questionCtrl', function (user, $timeout, $location) {

    var app = this;
    app.tags = false;

    user.gettags().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.tags = data.data.tags;
        } else {
            console.log('Tags not found.')
        }
    });
    app.errorMsg = false;
    app.limit = 5;
    //app.number = 0;

    user.getallQuestions().then(function (data) {
        if(data.data.success) {
            //console.log(data);
            //app.number = data.data.number;
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
                    //console.log(data);
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
        //console.log(id);
        //console.log(index);
        saveObj ={};
        saveObj.questionid = id;
        saveObj.answerindex = index;
        app.errorMsg = false;

        user.saveanswer(saveObj).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                console.log('Answer saved successfully');
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

    app.edits = function (index) {
        app.suggesteditsdiv = true;
        app.index = index;
    };

    app.successMsg = false;
    app.errorMsg = false;

    app.editSuggest = function (editData,id,index,author) {

        var editObj = {};
        editObj.data = app.editData.text;
        editObj.questionId = id;
        editObj.index = index;
        editObj.author = author;
        //console.log(editObj);

        user.sendEdit(editObj).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.suggesteditsdiv = false;
                app.successMsg = data.data.message;
                $timeout(function () {
                    app.successMsg = false;
                    app.editData.text = '';
                }, 2000 );

            } else {
                app.errorMsg = data.data.message;
                $timeout(function () {
                    app.errorMsg = false;
                }, 2000 );

            }
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

.controller('reportCtrl', function (user) {

    var app = this;
    app.errorMsg = false;
    app.reports = [];

    function report() {


        user.getreport().then(function (data) {
            //console.log(data);
            if(data.data.success) {
                //console.log('All report requests are here');
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
            //console.log(data);
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
                //console.log(data.data.success);
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
});