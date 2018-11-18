angular.module('userServices',[])

.factory('user', function ($http) {
    var userFactory = {};

    // user.create(regData);
    userFactory.create = function (regData) {
        return $http.post('/api/register' , regData);
    };

    // user.activateAccount(token);
    userFactory.activateAccount = function (token) {
        return $http.put('/api/activate/'+token);
    };

    // user.resendLink(logData);
    userFactory.checkCredientials = function (logData) {
        return $http.post('/api/resend',logData);
    };

    // user.resendEmail(username);
    userFactory.resendEmail = function (username) {
        return $http.put('/api/sendlink', username);
    };

    // user.forgotUsername(email);
    userFactory.forgotUsername = function (email) {
        return $http.post('/api/forgotUsername', email);
    };

    // user.forgotPasswordLink(username);
    userFactory.forgotPasswordLink = function (username) {
        return $http.put('/api/forgotPasswordLink', username);
    };

    // user.forgotPasswordCheckToken(token);
    userFactory.forgotPasswordCheckToken = function (token) {
        return $http.post('/api/forgotPassword/'+token);
    };

    // user.resetPassword(token,password);
    userFactory.resetPassword = function (token,password) {
        return $http.put('/api/resetPassword/'+token, password);
    };

    // user.getPermission();
    userFactory.getPermission = function () {
        return $http.get('/api/permission');
    };

    // get users from database
    userFactory.getUsers = function () {
        return $http.get('/api/management/');
    };

    // get user from id
    userFactory.getUser = function(id) {
        return $http.get('/api/edit/' + id);
    };

    //delete user from database
    userFactory.deleteUser = function (username) {
        return $http.delete('/api/management/'+username);
    };

    // edit details of user
    userFactory.editUser = function (id) {
        return $http.put('/api/edit/', id);
    };

    // ask question to other users
    userFactory.askQuestion =  function (question) {
        return $http.post('/api/askQuestion', question);
    };

    // get all questions
    userFactory.getallQuestions = function () {
        return $http.get('/api/questions');
    };

    // read question from id
    userFactory.readQuestion = function (id) {
        return $http.get('/api/readquestion/'+ id);
    };

    // get page according to page
    userFactory.tagPage = function (tagname) {
        return $http.get('/api/tag/'+tagname);
    };

    // upvote answer
    userFactory.upvote = function (upvoteObj) {
        return $http.put('/api/upvote/', upvoteObj);
    };

    // downvote answer
    userFactory.downvote = function (upvoteObj) {
        return $http.put('/api/downvote/', upvoteObj);
    };

    // add answer
    userFactory.addanswer = function (answerData) {
        return $http.put('/api/addanswer', answerData);
    };

    // get users profile
    userFactory.getProfile = function (username) {
        return $http.get('/api/getprofile/'+  username);
    };

    // check user allowed to answer or not
    userFactory.checkUser = function (checkObj) {
        return $http.post('/api/checkUser', checkObj);
    };

    // route to get all questions
    userFactory.getQuestions = function () {
        return $http.get('/api/questionManagement/');
    };

    // route to delete a question
    userFactory.deleteQuestion = function (id) {
        return $http.delete('/api/questionManagement/'+ id);
    };

    // delete answer
    userFactory.deleteAnswer = function (id,index) {
        return $http.delete('/api/deleteAnswer/'+id+'/'+index);
    };

    // save an answer
    userFactory.saveanswer = function (saveObj) {
        return $http.post('/api/saveanswer/', saveObj);
    };

    // display saved answers
    userFactory.getSavedanswers = function () {
        return $http.get('/api/getSavedanswers/');
    };

    // update views
    userFactory.updateViews = function (id) {
        return $http.put('/api/updateViews/'+id);
    };

    // get all tags
    userFactory.gettags = function () {
        return $http.get('/api/gettags');
    };

    // add tags to database
    userFactory.addtag = function (tagData) {
        return $http.post('/api/addtag' , tagData);
    };

    // delete tag
    userFactory.deletetag = function (tag) {
        return $http.delete('/api/deletetag/'+tag);
    };

    // user report a question
    userFactory.report = function (question) {
        return $http.post('/api/report',question);
    };

    // get all report request
    userFactory.getreport = function () {
        return $http.get('/api/getreport');
    };

    // route to delete a question
    userFactory.deleteReport = function (id) {
        return $http.delete('/api/deleteReport/'+ id);
    };

    // user checking following
    userFactory.checkfollow = function (username) {
        return $http.post('/api/checkfollow/'+ username);
    };

    // check following database
    userFactory.checkfollowdata = function (username) {
        return $http.post('/api/checkfollowdata/'+username);
    };

    // user following another user
    userFactory.followhim = function (username) {
        return $http.post('/api/followhim/'+ username);
    };

    // user unfollowing another user
    userFactory.unfollowhim = function (username) {
        return $http.post('/api/unfollowhim/'+ username);
    };

    // get users followers
    userFactory.getfollowers = function (username) {
        return $http.get('/api/followers/'+username);
    };

    // get users following
    userFactory.getfollowing = function (username) {
        return $http.get('/api/following/'+username);
    };

    // send edits
    userFactory.sendEdit = function (editData) {
        return $http.post('/api/sendEdit', editData);
    };

    // say thanks
    userFactory.saythanks = function (username) {
        //console.log(username);
        return $http.post('/api/saythanks', username);
    };

    // get questions
    userFactory.getQuestionsasked = function (username) {
        return $http.get('/api/getQuestionsasked/'+ username);
    };

    // get answered question by user
    userFactory.getQuestionsanswered = function (username) {
        return $http.get('/api/getQuestionsanswered/'+ username);
    };

    // add article
    userFactory.addArticle = function (articleData) {
        return $http.post('/api/addArticle', articleData);
    };

    // get all articles
    userFactory.getArticles = function () {
        return $http.get('/api/getArticles');
    };

    // read article
    userFactory.readArticle = function (id) {
        return $http.get('/api/readArticle/'+id);
    };

    // get un-approved articles for article management
    userFactory.getUnapprovedArticles = function () {
        return $http.get('/api/getUnapprovedArticles');
    };

    // approve article by admin
    userFactory.approveArticle = function (id) {
        return $http.put('/api/approveArticle/'+id);
    };

    // search user for coding profile
    userFactory.searchUser = function (userData) {
        return $http.post('/api/searchUser',userData);
    };

    // route to get current user
    userFactory.getCurrentUser = function () {
        return $http.get('/api/getCurrentUser');
    };

    // route to update coding handle usernames in database
    userFactory.updateCode = function (codeObj) {
        return $http.put('/api/updateCode', codeObj);
    };

    // testing socket.io
    userFactory.sendMsg = function (msgData) {
        return $http.post('/api/sendMsg', msgData);
    };

    // service to add data to guide database
    userFactory.addGuideData = function (guideData) {
        return $http.post('/api/addGuideData', guideData);
    };

    // service to update level
    userFactory.solvedProblem = function (problemData) {
        return $http.put('/api/solvedAll', problemData);
    };

    // update profile picture
    userFactory.updateProfilePic = function (URLData) {
        return $http.put('/api/updateProfilePic', URLData);
    };

    return userFactory;
});