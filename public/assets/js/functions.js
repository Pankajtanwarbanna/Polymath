function forgotSwitch(DivNumber) {

    var forgotUsername = document.getElementById('forgotUsername');
    var forgotPassword = document.getElementById('forgotPassword');
    var UsernameAnchor = document.getElementById('UsernameAnchor');
    var PasswordAnchor = document.getElementById('PasswordAnchor');

    if(DivNumber == 1) {
        forgotPassword.style.display = "none";
        forgotUsername.style.display = "block";
        UsernameAnchor.style.backgroundColor = 'green';
        PasswordAnchor.style.backgroundColor = '#0c5460';
    } else {
        forgotPassword.style.display = "block";
        forgotUsername.style.display = "none";
        UsernameAnchor.style.backgroundColor = '#0c5460';
        PasswordAnchor.style.backgroundColor = 'green';
    }
}