/* $('#emailAddressField').tooltip({trigger:'manual', placement:'auto', container:'body'});
$('#passwordField').tooltip({trigger:'manual', placement:'auto', container:'body'}); */

function showPasswordForm() {
    passwordLabel.innerHTML = "Welcome back, " + emailAddressField.value + ".";
    $("#emailEntryForm").fadeOut(function() {
        $("#passwordEntryForm").fadeIn(function() {
            setTimeout(function() { passwordField.focus(); }, 500);
        });
        $("#backButton").fadeIn();
        titleText.innerHTML = "Back";
    });
}

function showLoginForm(fast) {
    hideAllSnackMessages();
    if (!fast) {
        $("#passwordEntryForm").fadeOut()
        $("#backButton").fadeOut(function() {
            $("#emailEntryForm").fadeIn(function() {
                setTimeout(function() { emailAddressField.focus(); }, 500);
            });
            passwordLabel.innerHTML = "Enter your email ID:";
            titleText.innerHTML = "Log In";
        });
    } else {
        passwordEntryForm.style.display = "none";
        backButton.style.display = "none";
        titleText.innerHTML = "Log In";
        emailEntryForm.style.display = "initial";
        passwordField.value = "";
        emailAddressField.value = "";
        setTimeout(function() { emailAddressField.focus(); }, 500);
    }
}

function isValidPhoneNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 43 || charCode == 45) {
        // check if +/- is already there
        if (charCode == 43 && evt.target.value.indexOf("+") > -1) {
            return false;
        }
        if (charCode == 45 && evt.target.value.indexOf("-") > -1) {
            return false;
        }
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function showConfirmation(event) {
    event.preventDefault();
    button = emailConfirmationButton;
    
    try {
        $(".signon-button").attr("disabled", true);
        $(".signon-button-text").hide();
        $(".signon-loader-container").css('display', 'inline-block');
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/pas_backend/forgotPassword.php", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('Cache-Control', 'no-cache');

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                $(".signon-button-text").show();
                $(".signon-loader-container").hide();
                $(".signon-button").removeAttr("disabled");
                console.log(this.responseText);
                let responseArray = JSON.parse(this.responseText);
                let result = responseArray['result'];
                console.log(result);
                if (result == 'success') {
                    hideAllSnackMessages();
                    // recognize email provider
                    // onclick="window.open('https://www.gmail.com')

                    emailID = resetEmail.value;
                    emailProvider = emailID.split("@")[1];

                    emailProviders = {
                        "gmail.com" : {
                            text : "Go to Gmail",
                            link : "https://www.gmail.com"
                        },
                        "office.com" : {
                            text : "Go to Office 365",
                            link : "https://www.office.com"
                        },
                        "hotmail.com" : {
                            text : "Go to Outlook",
                            link : "https://outlook.live.com"
                        },
                        "outlook.com" : {
                            text : "Go to Outlook",
                            link : "https://outlook.live.com"
                        },
                        "live.com" : {
                            text : "Go to Outlook",
                            link : "https://outlook.live.com"
                        },
                        "yahoo.com" : {
                            text : "Go to Yahoo! Mail",
                            link : "https://login.yahoo.com"
                        },
                        "yahoo.co.in" : {
                            text : "Go to Yahoo! Mail",
                            link : "https://login.yahoo.com"
                        },
                        "rocketmail.com" : {
                            text : "Go to Yahoo! Mail",
                            link : "https://login.yahoo.com"
                        },
                        "zohomail.in" : {
                            text : "Go to Zoho Mail",
                            link : "https://www.zoho.com/mail/login.html"
                        }
                    }

                    emailProviderInfo = emailProviders[emailProvider];
                    
                    if (!emailProviderInfo) {
                        button.innerHTML = "Close";
                        button.onclick = function() {
                            $("#forgotPasswordModal").modal("hide");
                        };
                    } else {
                        button.innerHTML = emailProviderInfo.text;
                        button.onclick = function() {
                            window.location.href = emailProviderInfo.link;
                        };
                    }
                    emailConfirmationTextValue.innerHTML = "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.";
                    $("#resetPasswordForm").fadeOut();
                    $("#resetPasswordButton").fadeOut(function() { $("#emailConfirmationButton").fadeIn(); $("#emailConfirmationText").fadeIn(); });
                } else if (result == 'notexist') {
                    emailConfirmationTextValue.innerHTML = "An account with the given email address does not exist. Please ensure that you've provided the email correctly.";
                    button.innerHTML = "Close";
                    button.onclick = function() {
                        $("#forgotPasswordModal").modal("hide");
                    };
                    $("#resetPasswordForm").fadeOut();
                    $("#resetPasswordButton").fadeOut(function() { $("#emailConfirmationButton").fadeIn(); $("#emailConfirmationText").fadeIn(); });
                }
                else {
                    emailConfirmationTextValue.innerHTML = "There was an unexpected error during the process. Please try again later.";
                    button.innerHTML = "Close";
                    button.onclick = function() {
                        $("#forgotPasswordModal").modal("hide");
                    };
                    $("#resetPasswordForm").fadeOut();
                    $("#resetPasswordButton").fadeOut(function() { $("#emailConfirmationButton").fadeIn(); $("#emailConfirmationText").fadeIn(); });
                }
            } else if (this.status == 404) {
                $(".signon-button-text").show();
                $(".signon-loader-container").hide();
                $(".signon-button").removeAttr("disabled");
                emailConfirmationTextValue.innerHTML = "There was an unexpected error during the process. Please try again later.";
                button.innerHTML = "Close";
                button.onclick = function() {
                    $("#forgotPasswordModal").modal("hide");
                };
                $("#resetPasswordForm").fadeOut();
                $("#resetPasswordButton").fadeOut(function() { $("#emailConfirmationButton").fadeIn(); $("#emailConfirmationText").fadeIn(); });
            }
        };
        xhttp.send("emailID=" + resetEmail.value);
    } catch {
        $(".signon-button-text").show();
        $(".signon-loader-container").hide();
        $(".signon-button").removeAttr("disabled");
        emailConfirmationTextValue.innerHTML = "There was an unexpected error during the process. Please try again later.";
        button.innerHTML = "Close";
        button.onclick = function() {
            $("#forgotPasswordModal").modal("hide");
        };
        $("#resetPasswordForm").fadeOut();
        $("#resetPasswordButton").fadeOut(function() { $("#emailConfirmationButton").fadeIn(); $("#emailConfirmationText").fadeIn(); });
    }
}

function resetForgotPasswordConfirmation() {
    resetPasswordForm.style.display = "initial";
    resetPasswordButton.style.display = "initial";
    emailConfirmationButton.style.display = "none";
    emailConfirmationText.style.display = "none";
}

function onSignUp(event) {
    event.preventDefault();

    // check if password and confirmPassword are same
    pass = password.value;
    confirmPass = confirmPassword.value;
    hideAllSnackMessages();
    if (pass != confirmPass) {
        hideAllSnackMessages();
        showSnackMessage("Password and Confirm Password do not match.", null, {type:'error',container:'#signUpMessageContainer',autoHide:false,fullWidth:true})
        return;
    }
    //showSnackMessage("Please wait...", null, {type:'info',container:'#signUpMessageContainer',autoHide:false,fullWidth:true})
    /* $("#signUpModal").modal('hide');
    showMsgModal("Sign Up", "Sign Up Successful! Please check your inbox for the activation link.");
    return; */
    $(".signon-button").attr("disabled", true);
    $(".signon-button-text").hide();
    $(".signon-loader-container").css('display', 'inline-block');
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/signUp.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Cache-Control', 'no-cache');

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
            $(".signon-button-text").show();
            $(".signon-loader-container").hide();
            $(".signon-button").removeAttr("disabled");
            console.log(this.responseText);
            let responseArray = JSON.parse(this.responseText);
            let result = responseArray['result'];
            console.log(result);
            if (result == 'success') {
                hideAllSnackMessages();
                $("#signUpModal").modal('hide');
                showMsgModal("Sign Up Successful!", "Hooray, you have been signed up!<br>Please check your inbox for the activation link.");
            } else if (result == 'alreadyExists') {
                hideAllSnackMessages();
                showSnackMessage("An account with the same email address already exists!", null, {type:'warning',container:'#signUpMessageContainer',autoHide:false,fullWidth:true})
            }
            else {
                hideAllSnackMessages();
                showSnackMessage("There was an error during signing up for an account. Try again later.", null, {type:'error',container:'#signUpMessageContainer',autoHide:false,fullWidth:true})
            }
		}
    };
	xhttp.send($("#signUpForm").serialize());
}

$(document).ready(function () {
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    $(".toggle-password").click(function(e) {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
        input.focus();
    });

    verifyCookie(function() {
        window.location.href = "dashboard";
    });
});

function validateEmail(event) {
    event.preventDefault();
    hideAllSnackMessages();
    $(".signon-button").attr("disabled", true);
    $(".signon-button-text").hide();
    $(".signon-loader-container").css('display', 'inline-block');
    email_id = emailAddressField.value;
    // validate email on server
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/authenticate.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Cache-Control', 'no-cache');

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            $(".signon-button-text").show();
            $(".signon-loader-container").hide();
            $(".signon-button").removeAttr("disabled");
            let responseArray = JSON.parse(this.responseText);
            let result = responseArray['result'];
            if (result == 'valid') {
                console.log("Email address validation successful!");
                showPasswordForm();
            } else if (result == 'notactive') {
                console.log("Account not activated!");
                showSnackMessage("The account is not yet activated!", null, {type:'error',container:'#signOnMessageContainer',autoHide:false,fullWidth:true})
            } else {
                console.log("Email address validation failed!");
                showSnackMessage("An account with given e-mail ID doesn't exist!", null, {type:'error',container:'#signOnMessageContainer',autoHide:false,fullWidth:true})
            }
		}
    };
	xhttp.send("role=applicant&validate=email&emailID=" + email_id);
}

function validatePassword(event) {
    event.preventDefault();
    hideAllSnackMessages();
    $(".signon-button").attr("disabled", true);
    $(".signon-button-text").hide();
    $(".signon-loader-container").css('display', 'inline-block');
    email_id = emailAddressField.value;
    password = passwordField.value;
    remember_me = rememberMe.checked.toString();
    // validate email on server
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/authenticate.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Cache-Control', 'no-cache');

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
            $(".signon-button-text").show();
            $(".signon-loader-container").hide();
            $(".signon-button").removeAttr("disabled");
            console.log(this.responseText);
            let responseArray = JSON.parse(this.responseText);
            let result = responseArray['result'];
            if (result == 'valid') {
                console.log("Password validation successful!");
                window.location.href = "dashboard";
            } else {
                console.log("Password validation failed!");
                showSnackMessage("Incorrect Password! Please check and try again.", null, {type:'error',container:'#signOnMessageContainer',autoHide:false,fullWidth:true})
            }
		}
    };
    xhttp.send("role=applicant&validate=password&emailID=" + email_id + "&password=" + password + "&rememberMe=" + remember_me);
}

function showMsgModal(title, msg) {
    msgTitle.innerHTML = title;
    msgText.innerHTML = msg;
    $("#msgModal").modal({keyboard: false,backdrop: 'static'});
}

function showFatalErrorMsg(title, msg) {
    msgTitle.innerHTML = title;
    msgText.innerHTML = msg;
    msgButton.onclick = function() {
        window.location.href = "../";
    }
    setCookie('pas_auth', '', 0);
    $("#msgModal").modal({keyboard: false,backdrop: 'static'});
}