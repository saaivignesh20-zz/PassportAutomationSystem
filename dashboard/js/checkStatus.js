function onPageLoad(callback) {
	getUserApplicationDetails();
	callback();
}

function getUserApplicationDetails() {
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
				applicationNumber.innerHTML = result[0]['application_number'];
				applicantName.innerHTML = result[0]['full_name'] + " " +  result[0]['surname'];
				applicantEmailID.innerHTML = result[0]['email'];
				applicantMobileNumber.innerHTML = result[0]['mobile_number'];
				applicationStatus.innerHTML = result[0]['status'];
				applicationStatus.innerHTML = applicationStatus.innerHTML[0].toUpperCase() + applicationStatus.innerHTML.substr(1);
				

            } else {
				$("#homeBtn").click();
            }
        }
    };
    xhttp.send("info=applicationDetails");
}