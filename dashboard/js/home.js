function onPageLoad(callback) {
	greetUser();
	callback();
}

function greetUser() {
	greetings.innerHTML = "Welcome Team Backtrack!";
}