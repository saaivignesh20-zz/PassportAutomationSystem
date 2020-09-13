function onPageLoad(callback) {
	greetUser();
	callback();
}

function greetUser() {
	greetings.innerHTML = "Welcome " + window.screenName + "!";
}