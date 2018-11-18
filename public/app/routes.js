var app = angular.module('userRoutes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when('/guide', {
            templateUrl : '/app/views/pages/guide.html',
            controller : 'guideCtrl',
            controllerAs : 'guide',
            authenticated : true
        })

        .when('/articles', {
            templateUrl : '/app/views/pages/articles.html',
            controller : 'articleCtrl',
            controllerAs : 'article',
            authenticated : true
        })

        .when('/register', {
            templateUrl : '/app/views/users/register.html',
            controller : 'regCtrl',
            controllerAs : 'register',
            authenticated : false
        })

        .when('/logout', {
            templateUrl : '/app/views/users/logout.html',
            authenticated : false,
            controller : 'editCtrl',
            controllerAs : 'edit'
        })

        .when('/profile', {
            templateUrl : '/app/views/users/profile.html',
            authenticated : true
        })

        .when('/about', {
            templateUrl : '/app/views/pages/about.html',
            authenticated : false
        })

        .when('/contact', {
            templateUrl : '/app/views/pages/contact.html',
            authenticated : false
        })

        .when('/services', {
            templateUrl : '/app/views/pages/services.html',
            authenticated : false
        })

        .when('/activate/:token', {
            templateUrl : '/app/views/users/activation/activate.html',
            authenticated : false,
            controller : 'emailCtrl',
            controllerAs : 'email'
        })

        .when('/resend', {
            templateUrl : '/app/views/users/activation/resend.html',
            authenticated : false,
            controller : 'resendCtrl',
            controllerAs : 'resend'
        })

        .when('/forgot', {
            templateUrl : '/app/views/users/forgot.html',
            authenticated : false,
            controller : 'forgotCtrl',
            controllerAs : 'forgot'
        })

        .when('/forgotPassword/:token', {
            templateUrl : 'app/views/users/resetPassword.html',
            authenticated : false,
            controller : 'resetCtrl',
            controllerAs : 'reset'
        })

        .when('/management', {
            templateUrl : 'app/views/admin/management.html',
            authenticated : true,
            controller : 'managementCtrl',
            controllerAs : 'management',
            permission : 'admin'
        })

        .when('/userManagement', {
            templateUrl : 'app/views/admin/UserManagement.html',
            authenticated : true,
            controller : 'managementCtrl',
            controllerAs : 'management',
            permission : 'admin'
        })

        .when('/edit/:id', {
            templateUrl : 'app/views/admin/edit.html',
            authenticated : true,
            controller : 'editCtrl',
            controllerAs : 'edit',
            permission : 'admin'
        })

        .when('/askquestion', {
            templateUrl : 'app/views/askus/askquestion.html',
            authenticated : true,
            controller : 'questionCtrl',
            controllerAs : 'question'
        })

        .when('/question/:id', {
            templateUrl : 'app/views/askus/question.html',
            authenticated : true,
            controller : 'readQuestionCtrl',
            controllerAs : 'readquestion'
        })

        .when('/tag/:tagname', {
            templateUrl : 'app/views/askus/tag.html',
            authenticated : true,
            controller : 'tagCtrl',
            controllerAs : 'tag'
        })

        .when('/users/:username', {
            templateUrl : 'app/views/users/userProfile.html',
            authenticated : true,
            controller : 'usersprofileCtrl',
            controllerAs : 'usersprofile'
        })

        .when('/notifications', {
            templateUrl : 'app/views/users/notifications.html',
            authenticated : true,
            controller : 'notificationCtrl',
            controllerAs : 'notification'
        })

        .when('/report', {
            templateUrl : 'app/views/admin/report.html',
            authenticated : true,
            controller : 'reportCtrl',
            controllerAs : 'report'
        })

        .when('/questionManagement', {
            templateUrl : 'app/views/admin/questionManagement.html',
            authenticated : true,
            controller : 'questionManagementCtrl',
            controllerAs : 'questionManagement',
            permission : 'admin'
        })

        .when('/savedanswers', {
            templateUrl : 'app/views/users/savedanswers.html',
            authenticated : true,
            controller : 'savedAnswerCtrl',
            controllerAs : 'saved'
        })

        .when('/tagManagement', {
            templateUrl : 'app/views/admin/tagmanagement.html',
            authenticated : true,
            controller : 'tagmanagementCtrl',
            controllerAs : 'tagmanagement',
            permission : 'admin'
        })

        .when('/users/:username/followers', {
            templateUrl : 'app/views/users/followers.html',
            authenticated : true,
            controller : 'followerCtrl',
            controllerAs : 'followers'
        })

        .when('/users/:username/following', {
            templateUrl : 'app/views/users/following.html',
            authenticated : true,
            controller : 'followingCtrl',
            controllerAs : 'following'
        })

        .when('/users', {
            templateUrl : 'app/views/admin/users.html',
            authenticated : true,
            controller : 'usersCtrl',
            controllerAs : 'users'
        })

        .when('/tags', {
            templateUrl : 'app/views/users/tags.html',
            authenticated : true,
            controller : 'alltagCtrl',
            controllerAs : 'alltags'
        })

        .when('/answered/:username', {
            templateUrl : 'app/views/users/answered.html',
            authenticated : true,
            controller : 'answeredCtrl',
            controllerAs : 'questionanswered'
        })

        .when('/questionasked/:username', {
            templateUrl : 'app/views/users/questionasked.html',
            authenticated : true,
            controller : 'questionaskedCtrl',
            controllerAs : 'questionasked'
        })

        .when('/writeArticle', {
            templateUrl : 'app/views/articles/writeArticle.html',
            authenticated : true,
            controller : 'writeArticleCtrl',
            controllerAs : 'writeArticle'
        })

        .when('/article/:id', {
            templateUrl : 'app/views/articles/article.html',
            authenticated : true,
            controller : 'readArticleCtrl',
            controllerAs : 'readArticle'
        })

        .when('/articleManagement' , {
            templateUrl : 'app/views/admin/articleManagement.html',
            authenticated : true,
            controller : 'articleManagementCtrl',
            controllerAs : 'articleManagement',
            permission : 'admin'
        })

        .when('/searchUser', {
            templateUrl : 'app/views/scrapping/searchUser.html',
            authenticated :true,
            controller : 'searchUserCtrl',
            controllerAs : 'searchUser'
        })

        .when('/codeprofile/:username', {
            templateUrl : 'app/views/scrapping/codeprofile.html',
            authenticated : true,
            controller : 'codeprofileCtrl',
            controllerAs : 'codeprofile'
        })

        .when('/updateCodingHandles', {
            templateUrl : 'app/views/scrapping/updateCodingHandles.html',
            authenticated : true,
            controller : 'updateCodingHandlesCtrl',
            controllerAs : 'updateCodingHandles'
        })


        .when('/chatroom', {
            templateUrl : 'app/views/chat/chat-room.html',
            authenticated : true,
            controller : 'chatCtrl',
            controllerAs : 'chat'
        })

        .when('/guideManagement', {
            templateUrl : 'app/views/admin/guideManagement.html',
            authenticated : true,
            controller : 'guideManagementCtrl',
            controllerAs : 'guideManagement'
        })

        .when('/updateProfilePic', {
            templateUrl : 'app/views/users/updateProfilePic.html',
            authenticated : true,
            controller : 'upateProfilePicCtrl',
            controllerAs : 'profilePic'
        })

        .otherwise( { redirectTo : '/'});

        $locationProvider.html5Mode({
            enabled : true,
            requireBase : false
        })
});

app.run(['$rootScope','auth','$location', 'user', function ($rootScope,auth,$location,user) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if(next.$$route) {

            if(next.$$route.authenticated === true) {

                if(!auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                } else if(next.$$route.permission) {

                    user.getPermission().then(function (data) {

                        if(next.$$route.permission !== data.data.permission) {
                            event.preventDefault();
                            $location.path('/');
                        }

                    });
                }

            } else if(next.$$route.authenticated === false) {

                if(auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile');
                }

            } /*else {
                console.log('auth doesnot matter');
            }
            */
        } /*else {
            console.log('Home route is here');
        }
*/
    })
}]);

