angular.module('userApp', ['userRoutes','userCtrl','mainController','emailController','managementController','questionController'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});