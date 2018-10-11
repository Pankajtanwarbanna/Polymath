angular.module('userCtrl',['userServices'])

.controller('regCtrl', function ($scope, $http, $timeout, $location,user) {

    var app = this;

    this.regUser = function (regData) {

        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;

        user.create(app.regData).then(function (data) {

            //console.log(data);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + ' Redirecting to home page...';
                $timeout(function () {
                    $location.path('/');
                }, 2000);
                
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('followerCtrl', function (user,$routeParams) {

    var app = this;

    user.getfollowers($routeParams.username).then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.followers = data.data.followers;
            console.log('success');
        } else {
            console.log('Error.');
        }
    });
})

.controller('followingCtrl', function (user,$routeParams) {

    var app = this;

    user.getfollowing($routeParams.username).then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.following = data.data.following;
            console.log('success');
        } else {
            console.log('Error.');
        }
    });
})

.controller('usersCtrl', function (user) {
    var app = this;

    user.getUsers().then(function (data) {

        if(data.data.success) {
            //console.log(data.data.users);
            app.users = data.data.users;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

.controller('alltagCtrl', function (user) {
    console.log('testing tags routes');
    var app = this;

    function gettag() {

        user.gettags().then(function (data) {
            if(data.data.success) {
                app.tags = data.data.tags;
            } else {
                console.log('Tags not found.')
            }
        });

    }
    gettag();
})

.controller('savedAnswerCtrl', function ($routeParams,user) {

    var app = this;

    app.savedanswers = false;
    app.errorMsg = false;

    user.getSavedanswers().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.savedanswers = data.data.savedArray;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

// controller to get all the question asked by user
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

// Controller to get all the answer by user
.controller('answeredCtrl', function ($routeParams,user) {

    var app = this;

    app.number = false;
    app.errorMsg = false;
    app.questionAnswered = false;
    app.author = $routeParams.username;

    //console.log($routeParams.username);
    user.getQuestionsanswered($routeParams.username).then(function (data) {
        //console.log(data);

        if(data.data.success) {
            app.number = data.data.number;
            app.questionsAnswered = data.data.questionsAnswered;
        } else {
            app.errorMsg = data.data.message;
        }

    })

})

.controller('notificationCtrl', function () {

    console.log('Notification Ctrl is not built yet.')

})


.controller('usersprofileCtrl', function (user,$routeParams) {
    // this controller will show the profile page of user at which we click
    var app = this;
    app.errorMsg = false;
    app.username = false;
    app.name = false;
    app.email = false;
    app.permission = false;
    app.sameuser = false;
    app.follow = false;

    function followFunction() {

        user.checkfollow($routeParams.username).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                user.checkfollowdata($routeParams.username).then(function (data) {
                    //console.log(data);
                    if(data.data.success) {
                        app.follow = false;
                    } else {
                        app.follow = true;
                    }
                });
            } else {
                app.sameuser = true;
            }
        });
    }

    followFunction();

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

        user.followhim($routeParams.username).then(function (data) {
            console.log(data);
            if(data.data.success) {
                followFunction();
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };

});