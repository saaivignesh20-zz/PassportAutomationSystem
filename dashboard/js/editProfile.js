function onPageLoad(callback) {
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
    getUserProfileDetails();
    callback();
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

function getUserProfileDetails() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/getDetails.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Cache-Control', 'no-cache');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let responseArray = JSON.parse(this.responseText);
            let result = responseArray['result'];
            if (result != false) {
                firstName.value = result['first_name'];
                middleName.value = result['middle_name'];
                lastName.value = result['last_name'];
                emailID.value = result['email_id'];
                mobileNumber.value = result['mobile_number'];
            }
        }
    };
    xhttp.send("info=profileDetails");
}

function updateProfile(event) {
    event.preventDefault();
    hideAllSnackMessages();

    validateMsg = "";

    // validate fields
    
    // mobileNumber - Allow only Numbers and +,-
	if (mobileNumber.value != "") {
		if(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(mobileNumber.value) == false) {
			validateMsg += "Mobile Number can contain only numbers (0-9) and +,-.<br>"
		}
	} else {
		validateMsg += "Mobile Number is a required field.<br>"
	}
	
	// emailAddressValue - Allow only valid email address
	if (emailID.value != "") {
		if(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(emailID.value) == false) {
			validateMsg += "Email is not valid.<br>"
		}
	} else {
		validateMsg += "Email is a required field.<br>"
    }
    
    if (validateMsg == "") {
		updateUserProfileDetails();
	} else {
		console.log(validateMsg);
		showSnackMessage(validateMsg, null, {type:'error',container:'#updateProfileValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
		goToTop();
	}
}

function updateUserProfileDetails() {
    hideAllSnackMessages();
    $(".signon-button").attr("disabled", true);
    $(".signon-button-text").hide();
    $(".signon-loader-container").css('display', 'inline-block');
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/updateDetails.php", true);
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
            if (result != false) {
                if (result == 'success') {
                    showFatalErrorMsg("Update Profile Successful", "The user profile has been updated successfully! You'll be signed out now. Please sign in again.");
                } else if (result == 'failure') {
                    showErrorMsg("Update Profile Failed", "There was an unexpected error while updating the user profile. Please try again later.");
                } else if (result == 'dataEqual') {
                    showMsgModal("Cannot Update Profile", "No changes were made to user profile!");
                }
            } else {
                showErrorMsg("Update Profile Failed", "There was an unexpected error while updating the user profile. Please try again later.");
            }
        }
    };
    xhttp.send($("#editProfileForm").serialize());
}

function updatePassword(event) {
    event.preventDefault();
    hideAllSnackMessages();
    
    let currentPasswordValue = password.value.trim();
    let newPasswordValue = newPassword.value.trim();
    let confirmNewPasswordValue = confirmPassword.value.trim();

    // validate fields
    if (newPasswordValue == "" || confirmNewPasswordValue == "" || currentPasswordValue == "") {
        showSnackMessage("Please fill all the required fields for updating password.", null, {type:'error',container:'#updateProfileValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
    } else {
        if (newPasswordValue == confirmNewPasswordValue) {
            // verify if it's not equal to current password
            if (newPasswordValue != currentPasswordValue) {
                $(".signon-button").attr("disabled", true);
                $(".signon-button-text").hide();
                $(".signon-loader-container").css('display', 'initial');
                // verify current password
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", "/pas_backend/validatePassword.php", true);
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
                        if (result != undefined) {
                            if (result == 'valid') {
                                updateUserPassword(newPasswordValue);
                            } else {
                                showErrorMsg("Update Password Failed", "The entered current password is incorrect. Please check and try again.");
                            }
                        } else {
                            showErrorMsg("Update Password Failed", "There was an unexpected error while updating the password. Please try again later.");
                        }
                    }
                };
                xhttp.send("password=" + currentPasswordValue);
            } else {
                showSnackMessage("Current password and new password cannot be same.", null, {type:'error',container:'#changePasswordValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
            }
        } else {
            showSnackMessage("New password and confirm password do not match.", null, {type:'error',container:'#changePasswordValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
        }
    }
    
    if (validateMsg == "") {
		updateUserPassword(password);
	} else {
		console.log(validateMsg);
		showSnackMessage(validateMsg, null, {type:'error',container:'#changePasswordValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
		goToTop();
	}
}

function updateUserPassword(password) {
    hideAllSnackMessages();
    $(".signon-button").attr("disabled", true);
    $(".signon-button-text").hide();
    $(".signon-loader-container").css('display', 'initial');
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/updatePassword.php", true);
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
            if (result != false) {
                if (result == 'success') {
                    showFatalErrorMsg("Update Password Successful", "The password has been updated successfully! You'll be signed out now. Please sign in again.");
                } else if (result == 'failure') {
                    showErrorMsg("Update Password Failed", "There was an unexpected error while updating the password. Please try again later.");
                } else if (result == 'dataEqual') {
                    showMsgModal("Cannot Update Password", "No changes were made to password!");
                }
            } else {
                showErrorMsg("Update Password Failed", "There was an unexpected error while updating the password. Please try again later.");
            }
        }
    };
    xhttp.send("password=" + password);
}