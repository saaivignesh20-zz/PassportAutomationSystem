function onPageLoad(callback) {
	greetUser();	
	getUserApplicationStatus(function(status) {
		if (status == "pending") {
			applicationStatusCardText.innerHTML = "Pending";
			applicationStatusCard.classList.remove("bg-passport-gray");
			applicationStatusCard.classList.add("bg-info");
		} else if (status == "verification") {
			applicationStatusCardText.innerHTML = "Under Police Verification";
			applicationStatusCard.classList.remove("bg-passport-gray");
			applicationStatusCard.classList.add("bg-primary");
		} else if (status == "approved") {
			applicationStatusCardText.innerHTML = "Approved";
			applicationStatusCard.classList.remove("bg-passport-gray");
			applicationStatusCard.classList.add("bg-success");

			passportStatusCardText.innerHTML = "Active";
			passportStatusCard.classList.remove("bg-passport-gray");
			passportStatusCard.classList.add("bg-info");

			getPassportExpiryDate();
		} else if (status == "rejected") {
			applicationStatusCardText.innerHTML = "Rejected";
			applicationStatusCard.classList.remove("bg-passport-gray");
			applicationStatusCard.classList.add("bg-danger");
		} else {
			applicationStatusCardText.innerHTML = "Not Applied";
		}
	});
	callback();
}

function greetUser() {
	greetings.innerHTML = "Welcome " + window.screenName + "!";
}

function getPassportExpiryDate() {
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
				let d = new Date(Date.parse(result));
				let date = d.getDate();
				date < 10 ? date = "0" + date : date =  date;
				let month = d.getMonth() + 1;
				month < 10 ? month = "0" + month : month =  month;
				let year = d.getFullYear() + 10;
				passportExpiryDateCardText.innerHTML = date + "/" + month + "/" + year;
            }
        }
    };
	xhttp.send("role=applicant&info=passportApplicationDate");
}
