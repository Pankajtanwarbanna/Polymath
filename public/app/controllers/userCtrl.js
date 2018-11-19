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

.controller('followerCtrl', function (user,$routeParams,$location) {

    var app = this;

    user.getfollowers($routeParams.username).then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.followers = data.data.followers;
            console.log('success');
        } else {
            console.log(data.data.message);
            event.preventDefault();
            $location.path('/');
        }
    });
})

.controller('followingCtrl', function (user,$routeParams,$location) {

    var app = this;

    user.getfollowing($routeParams.username).then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.following = data.data.following;
            console.log('success');
        } else {
            console.log(data.data.message);
            event.preventDefault();
            $location.path('/');
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
.controller('questionaskedCtrl', function ($routeParams, user,$location) {
    //console.log($routeParams.username);
    var app = this;

    user.getQuestionsasked($routeParams.username).then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.questions = data.data.questions;
        } else {
            app.errorMsg = data.data.message;
            console.log(data.data.message);
            event.preventDefault();
            $location.path('/');
        }
    });
})

// Controller to get all the answer by user
.controller('answeredCtrl', function ($routeParams,user,$location) {

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
            //app.errorMsg = data.data.message;
            console.log(data.data.message);
            event.preventDefault();
            $location.path('/');
        }

    })

})

.controller('notificationCtrl', function () {

    console.log('Notification Ctrl is not built yet.')

})


.controller('usersprofileCtrl', function (user,$routeParams,$location) {
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
        console.log(data);
        if(data.data.success) {
            app.username = data.data.user.username;
            app.email = data.data.user.email;
            app.name = data.data.user.name;
            app.permission = data.data.user.permission;
            app.id = data.data.user._id;
            app.link = data.data.user.profilepicurl;
            // more entries to be add

        } else {
            console.log(data.data.message);
            event.preventDefault();
            $location.path('/');
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

    app.unfollowhim = function () {

        user.unfollowhim($routeParams.username).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                followFunction();
            } else {
                app.errorMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    };

})

.controller('guideCtrl', function (user, $http) {

    console.log('guide page ctrl');

    var app = this;

    function getData() {

        $http.get('/api/getGuideDataWithLevel').then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.guideData = data.data.data;
            } else {
                app.errorMsg = data.data.message;
            }
        });


    }

    getData();

    app.solvedProblem = function (problemData) {
        console.log(problemData);
        user.solvedProblem(problemData).then(function (data) {
            if(data.data.success) {
                console.log(data.data.success);
                getData();
            }
        });
    }

})

.controller('articleCtrl', function (user) {

    var app = this;
    app.articles = false;

    user.getArticles().then(function (data) {
        if(data.data.success) {
            app.articles = data.data.articles;
        } else {
            app.errorMsg = data.data.message;
        }
    });

})

.controller('writeArticleCtrl', function (user) {

    var app = this;

    app.tags = false;
    app.successMsg = false;
    app.errorMsg = false;

    user.gettags().then(function (data) {
        if(data.data.success) {
            app.tags = data.data.tags;
        } else {
            console.log('Tags not found.')
        }
    });

    app.addArticle = function (articleData) {
        user.addArticle(articleData).then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        })
    };

})

.controller('readArticleCtrl', function ($routeParams, user) {
    var app = this;

    app.article = false;

    user.readArticle($routeParams.id).then(function (data) {
        if(data.data.success) {
            app.topic = data.data.article.topic;
            app.content = data.data.article.content;
            app.author = data.data.article.author;
            app.tag = data.data.article.tag;
            app.approved = data.data.article.approved;
        } else {
            app.errorMsg = data.data.message;
        }
    });

})

.controller('searchUserCtrl', function (user,$location) {
    var app = this;

    app.errorMsg = false;

    app.searchUser = function (userData) {
        user.searchUser(app.userData).then(function (data) {
            if(data.data.success) {
                $location.path('/codeprofile/'+app.userData.username);
            } else {
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('codeprofileCtrl', function () {
    console.log('testing');
})

.controller('updateCodingHandlesCtrl', function (user, $scope,$timeout) {
    var app = this;

    user.getCurrentUser().then(function (data) {
        console.log(data);
        if(data.data.success) {
            $scope.codechef = data.data.user.codinghandle[0].codechef;
            $scope.codeforces = data.data.user.codinghandle[1].codeforces;
            $scope.hackerrank = data.data.user.codinghandle[2].hackerrank;
            $scope.hackerearth = data.data.user.codinghandle[3].hackerearth;
            $scope.github = data.data.user.codinghandle[4].github;
        } else {
            console.log('Error in getting current User.');
        }
    });

    app.updateCode = function (codechef,codeforces,hackerrank,hackerearth,github) {

        console.log(codechef);
        /*
        var codeObj = {};
        codeObj.codechef = app.codechef;
        codeObj.codeforces = app.codeforces;
        codeObj.hackerearth = app.hackerearth;
        codeObj.hackerrank = app.hackerrank;
        codeObj.github = app.github;

        console.log(codeObj);
        console.log('testing');
        user.updateCode(codeObj).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
                $timeout(function () {
                    app.successMsg = '';
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
            }
        });
        */
    }
})

// User chat controller
.controller('chatCtrl', function (user, $scope) {

    var app = this;
    // initialize socket.io
    var socket = io();

    $scope.messages = [];

    socket.on('chat message', function(msgObj){
        // $apply as messages were getting updated outside of the scope
        $scope.$apply(function() {
            $scope.messages.push(msgObj);
        });
    });

    var msgDataObj = {};

    app.sendMsg = function (msgData) {

        msgDataObj.msg = app.msgData.msg;

        user.sendMsg(msgDataObj);

        app.msgData.msg = '';
    };
})

.controller('upateProfilePicCtrl' , function (user, $timeout) {
   var app = this;

   app.updateProfilePic = function (URLData) {
       console.log(app.URLData);
       user.updateProfilePic(app.URLData).then(function (data) {
           console.log(data);
           if(data.data.success) {
               app.successMsg = data.data.message;
               $timeout(function () {
                   app.successMsg = '';
                   app.URLData.link = '';
               }, 2000);
           } else {
               app.errorMsg = data.data.message;
           }
       });
   }
});