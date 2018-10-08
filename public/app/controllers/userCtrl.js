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
        console.log(data);
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
});