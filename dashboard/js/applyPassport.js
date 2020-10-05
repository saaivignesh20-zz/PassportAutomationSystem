function onPageLoad(callback) {
	greetings.innerHTML = "Passport Application - Step 1";
	getUserProfileDetails();
	callback();
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
                fullName.value = result['first_name'] + " " + result['middle_name'];
                surname.value = result['last_name'];
                email.value = result['email_id'];
                mobileNumber.value = result['mobile_number'];
            }
        }
    };
    xhttp.send("info=profileDetails");
}

function goToStepTwo() {
	validateStepOne(function() {
		$("#applicationStep1").fadeOut(function() {
			greetings.innerHTML = "Passport Application - Step 2";
			$("#applicationStep2").fadeIn();
		});
	});
}

function goToStepOne() {
	validateStepTwo(function() {
		$("#applicationStep2").fadeOut(function() {
			greetings.innerHTML = "Passport Application - Step 1";
			$("#applicationStep1").fadeIn();
		});
	});
}

function validateStepOne(callback) {
	hideAllSnackMessages();
	var fullNameValue = $('input[name="fullName"]').val();
	var surnameValue = $('input[name="surname"]').val();
	var genderValue = $('input[name="gender"]:checked').val();
	var dobValue = $('input[name="dateOfBirth"]').val();
	var mobileNumberValue = $('input[name="mobileNumber"]').val();
	var phoneNumberValue = $('input[name="phoneNumber"]').val();
	var emailAddressValue = $('input[name="email"]').val();
	var addressValue = $('input[name="address"]').val();
	var stateValue = $('select[name="state"]').val();
	var citizenshipValue = $('select[name="citizenship"]').val();
	var panNumberValue = $('input[name="panNumber"]').val();
	var voterIDValue = $('input[name="voterID"]').val();

	var validateMsg = "";

	/* validate each field */

	// fullName - Allow only alphabets
	if (fullNameValue != "") {
		if(/^[a-zA-Z\s]*$/.test(fullNameValue) == false) {
			validateMsg += "Full Name can contain only alphabets (a-z, A-Z).<br>"
		}
	} else {
		validateMsg += "Full Name is a required field.<br>"
	}
	

	// surname - Allow only alphabets
	if (surnameValue != "") {
		if(/^[a-zA-Z\s]*$/.test(surnameValue) == false) {
			validateMsg += "Surname can contain only alphabets (a-z, A-Z).<br>"
		}
	} else {
		validateMsg += "Surname is a required field.<br>"
	}

	// gender - Allow only Male, Female, Other
	if (genderValue != undefined) {
		if (genderValue != "Male" && genderValue != "Female" && genderValue != "Other") {
			validateMsg += "Gender can only be either Male, Female or Other."
		}
	} else {
		validateMsg += "Gender is a required field.<br>"
	}
	

	// dateOfBirth - Allow only maximum of 110 yrs as age
	if (dobValue != "") {
		year = dobValue.substr(0,4);
		d = new Date();
		currentYear = d.getFullYear();
		diff = currentYear - year;
		if (diff < 0) {
			validateMsg += "Age cannot be negative.<br>"
		} else if (diff > 110) {
			validateMsg += "Age cannot be more than maximum life expectancy.<br>"
		}
	} else {
		validateMsg += "Date of Birth is a required field.<br>"
	}

	// mobileNumber - Allow only Numbers and +,-
	if (mobileNumberValue != "") {
		if(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(mobileNumberValue) == false) {
			validateMsg += "Mobile Number can contain only numbers (0-9) and +,-.<br>"
		}
	} else {
		validateMsg += "Mobile Number is a required field.<br>"
	}
	
	// phoneNumber - Allow only Numbers and +,-
	if (phoneNumberValue != "") {
		if(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phoneNumberValue) == false) {
			validateMsg += "Phone Number can contain only numbers (0-9) and +,-.<br>"
		}
	} else {
		validateMsg += "Phone Number is a required field.<br>"
	}

	// emailAddressValue - Allow only valid email address
	if (emailAddressValue != "") {
		if(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(emailAddressValue) == false) {
			validateMsg += "Email is not valid.<br>"
		}
	} else {
		validateMsg += "Email is a required field.<br>"
	}

	// Address - Allow only alphanumeric and some special characters
	if (addressValue != "") {
		if(/^[a-z\d\-./,\s]+$/i.test(addressValue) == false) {
			validateMsg += "Address can contain only alphanumeric characters, and [ / , . - ].<br>"
		}
	} else {
		validateMsg += "Address is a required field.<br>"
	}

	// State - just check it's not empty
	if (stateValue != "") {
		
	} else {
		validateMsg += "State is a required field.<br>"
	}

	// Citizenship of India By - just check it's not empty
	if (citizenshipValue != "") {
		
	} else {
		validateMsg += "Citizenship of India by is a required field.<br>"
	}

	// PAN - optional - check for format if it is provided
	if (panNumberValue != "") {
		if (/^[a-zA-Z0-9]+$/.test(panNumberValue) == false) {
			validateMsg += "PAN Number can contain only alphanumeric characters.<br>"
		} else {

		}
	}

	// Voter ID - optional - check for format if it is provided
	if (voterIDValue != "") {
		if (/^[a-zA-Z0-9]+$/.test(voterIDValue) == false) {
			validateMsg += "Voter ID can contain only alphanumeric characters.<br>"
		} else {
			
		}
	}

	if (validateMsg == "") {
		callback();
	} else {
		console.log(validateMsg);
		showSnackMessage(validateMsg, null, {type:'error',container:'#passportApplicationValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
		goToTop();
	}
}

function validateStepTwo(callback) {
	hideAllSnackMessages();
	
	rpoStateValue = $('select[name="rpoState"]').val();
	rpoDistrictValue = $('select[name="rpoDistrict"]').val();
	rpoCentreValue = $('input[name="rpoCentre"]:checked').val();
	passportTypeValue = $('input[name="passportType"]:checked').val();
	passportBookletPagesValue = $('input[name="passportBookletPages"]:checked').val();

	var validateMsg = "";

	/* validate fields */
	
	// rpoState
	if (rpoStateValue == "") {
		validateMsg += "State is a required field.<br>";
	}

	// rpoDistrict
	if (rpoDistrictValue == "") {
		validateMsg += "District is a required field.<br>";
	}

	// rpoCentre
	if (rpoCentreValue != undefined) {
		if (rpoCentreValue != "CPV Delhi" && rpoCentreValue != "Passport Office") {
			validateMsg += "RPO Office should be either CPV Delhi or Passport Office.<br>";
		}
	} else {
		validateMsg += "Register to apply at is a required field.<br>";
	}

	// passportType
	if (passportTypeValue != undefined) {
		if (passportTypeValue != "Normal" && passportTypeValue != "Tatkal") {
			validateMsg += "Passport Type should be either Normal or Tatkal.<br>";
		}
	} else {
		validateMsg += "Passport Type is a required field.<br>";
	}

	// passportBookletPages
	if (passportBookletPagesValue != undefined) {
		if (passportBookletPagesValue != "36" && passportBookletPagesValue != "60") {
			validateMsg += "Passport Booklet Pages should be either 36 or 60 pages.<br>";
		}
	} else {
		validateMsg += "Pages in Passport Booklet is a required field.<br>";
	}

	if (validateMsg == "") {
		callback();
	} else {
		console.log(validateMsg);
		showSnackMessage(validateMsg, null, {type:'error',container:'#passportApplicationValidationContainer',autoHide:false,fullWidth:true,leftAlign:true,noMargin:true})
		goToTop();
	}
}

function submitApplication() {
	validateStepTwo(function() {
		// all field validations passed, ask confirmation
		confirmCallback = function() {
			// POST using AJAX to Backend
			$("#confirmButton").attr("disabled", true);
			$(".signon-button-text").hide();
			$(".signon-loader-container").css('display', 'initial');
			$("#cancelButton").hide();
		
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/pas_backend/submitApplication.php", true);
			xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhttp.setRequestHeader('Cache-Control', 'no-cache');
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					$(".signon-button-text").show();
					$(".signon-loader-container").hide();
					$("#confirmButton").removeAttr("disabled");
					$("#cancelButton").show();
					$("#confirmationModal").modal('hide');
				
					console.log(this.responseText);
					let responseArray = JSON.parse(this.responseText);
					let result = responseArray['result'];
					if (result != '') {
						if (result == 'success') {
							showMsgModal("Submit Application Success!", "The application form has been successfully submitted!");
							msgButton.onclick = function() { $("#homeBtn").click(); };
						} else {
							showMsgModal("Submit Application Success!", "The application form has been successfully submitted!");
							msgButton.onclick = function() { $("#homeBtn").click(); };
						}
					} else {
						showErrorMsg("Submit Application Error", "There was an unexpected error while submitting the application. Please try again later.");
					}
				}
			};
			xhttp.send("action=submitApplication&" + $("#passportApplicationForm").serialize());
		};
		showConfirmationDialog("Submit Application", "Are you sure you want to submit the application?<br><b>Please make sure that you have verified the application twice before submission.</b><br><br>By submitting the application, you declare that the information provided by you is to the best of your knowledge and any discrepancy in the data would lead to permanent ban on international travel.", confirmCallback, null)
	});
}