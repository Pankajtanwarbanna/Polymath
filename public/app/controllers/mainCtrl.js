angular.module('mainController', ['authServices'])

.controller('mainCtrl', function ($window,$http, auth, $timeout, $location, authToken, $rootScope, user) {

    var app = this;

    app.loadme = false;
    app.home = true;

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        //console.log('user is changing routes');
        //console.log($window.location.pathname);
        if(next.$$route) {
            //console.log('we are not at home page');
            app.home = false;
        } else {
            app.home = true;
        }


        if(auth.isLoggedIn()) {

            app.views = false;
            app.likes = false;
            app.totalanswers = false;
            app.admin = false;

            user.getallQuestions().then(function (data) {
                if(data.data.success) {
                    app.questions = data.data.questions;
                    app.views = data.data.views;
                    app.likes = data.data.likes;
                    app.totalanswers = data.data.totalanswers;
                    app.admin = data.data.admin;
                    app.number = data.data.number;
                } else {
                    app.errorMsg = data.data.message;
                    app.admin = data.data.admin;
                }
            });

            //console.log('User is logged in.');
            app.isLoggedIn = true;
            auth.getUser().then(function (data){
                //console.log(data);
                app.name = data.data.name;
                app.email = data.data.email;
                app.username = data.data.username;
                user.getPermission().then(function (data) {
                    if(data.data.permission === 'admin') {
                        app.authorized = true;
                        app.loadme = true
                    } else {
                        app.authorized = false;
                        app.loadme = true;
                    }
                });
            });

        } else {

            //console.log('User is not logged in.');
            app.isLoggedIn = false;
            app.name = '';

            app.loadme = true;
        }

    });


    this.doLogin = function (logData) {
        //console.log(this.logData);
        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;
        app.expired = false;
        app.disabled = false;

        auth.login(app.logData).then(function (data) {
            //console.log(data);
            //app.loading = true;

            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + ' Redirecting to home page...';
                $timeout(function () {
                    $location.path('/');
                    app.logData.username = '';
                    app.logData.password = '';
                    app.successMsg = false;
                }, 2000);

            } else {
                app.disabled = false;
                if(data.data.expired) {
                    app.disabled = true;
                    app.loading = false;
                    app.errorMsg = data.data.message;
                    app.expired = data.data.expired;
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            }
        });
    };

    this.logout = function () {
        auth.logout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/');
        }, 2000);
    };

    app.report = function (question) {
        app.errorMsg = false;
        user.report(question).then(function (data) {
            if(data.data.success) {
                console.log('Question reported successfully');
            } else {
                console.log(data.data.message);
                app.errorMsg = data.data.message;
                $timeout(function () {
                    app.errorMsg = '';
                }, 2000);
            }
        });
    };

});