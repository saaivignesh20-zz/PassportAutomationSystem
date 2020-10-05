function onPageLoad(callback) {
	greetUser();
	getUserApplicationStatus(function(status) {
		if (status == "pending") {
			applicationStatusCardText.innerHTML = "Pending";
			applicationStatusCard.classList.remove("bg-passport-gray");
			applicationStatusCard.classList.add("bg-info");
		} else {
			console.log(status);
			applicationStatusCardText.innerHTML = "Not Applied";
		}
	});
	callback();
}

function greetUser() {
	greetings.innerHTML = "Welcome " + window.screenName + "!";
}

