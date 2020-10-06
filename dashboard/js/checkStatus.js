function onPageLoad(callback) {
    getUserApplicationDetails();
    $("#applicationNumber").on("click", function(event) {
        event.preventDefault();
        $("#viewApplicationModal").modal('show');
    })
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
                
                // fill viewApplicationModal Fields
                passportPhoto.src = "/pas_backend/uploads/" + result[0]['passport_photo'];
                fullName.value = result[0]['full_name'];
                surname.value = result[0]['surname'];
                gender.value = result[0]['gender'];
                let dob = new Date(Date.parse(result[0]['date_of_birth']));
                dateOfBirth.value = dob.getDate() + "/" + (dob.getMonth() + 1) + "/" + dob.getFullYear();
                mobileNumber.value = result[0]['mobile_number'];
                phoneNumber.value = result[0]['phone_number'];
                email.value = result[0]['email'];
                address.value = result[0]['address'];
                state.value = result[0]['state'];
                citizenship.value = result[0]['citizenship'];
                idProofNumber.value = result[0]['id_proof_number'];
                voterID.value = result[0]['voter_id'];
                idProof.src = "/pas_backend/uploads/" + result[0]['id_proof'];
                addressProof.src = "/pas_backend/uploads/" + result[0]['address_proof'];
                rpoState.value = result[0]['rpo_state'];
                rpoDistrict.value = result[0]['rpo_district'];
                rpoCentre.value = result[0]['rpo_centre'];
                passportType.value = result[0]['passport_type'];
                passportBookletPages.value = result[0]['passport_booklet_pages'];
            } else {
				$("#homeBtn").click();
            }
        }
    };
    xhttp.send("role=applicant&info=applicationDetails");
}