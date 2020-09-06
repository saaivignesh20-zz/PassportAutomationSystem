function showPasswordForm(event) {
    event.preventDefault();
    passwordLabel.innerHTML = "Welcome back, " + emailAddressField.value + ".";
    $("#emailEntryForm").fadeOut(function() {
        $("#passwordEntryForm").fadeIn();
        $("#backButton").fadeIn();
        titleText.innerHTML = "Back";
    });
}

function showLoginForm(fast) {
    if (!fast) {
        $("#passwordEntryForm").fadeOut()
        $("#backButton").fadeOut(function() {
            $("#emailEntryForm").fadeIn();
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

    $("#resetPasswordForm").fadeOut();
    $("#resetPasswordButton").fadeOut(function() { $("#emailConfirmationButton").fadeIn(); $("#emailConfirmationText").fadeIn(); });
}

function resetForgotPasswordConfirmation() {
    resetPasswordForm.style.display = "initial";
    resetPasswordButton.style.display = "initial";
    emailConfirmationButton.style.display = "none";
    emailConfirmationText.style.display = "none";
}

function onSignup() {
    event.preventDefault();
    $("#signUpCompleteModal").modal("show");
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
});

function validateEmail(event) {
    event.preventDefault();
    email_id = emailAddressField.value;
    // validate email on server
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};
	xhttp.open("POST", "/pas_backend/authenticate.php", true);
	xhttp.setRequestHeader('Cache-Control', 'no-cache');
	xhttp.send("validate=email&value=" + email_id);
}