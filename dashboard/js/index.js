var screenName = "";
var navData = "";
$(document).ready(function () {
    updateTime();
    clk = setInterval(updateTime, 1000);
    $(window).on("popstate", function(e) {
        handleQuery();
    });
    $("a").on("click", function(event) {
        event.preventDefault();
        link = $(event.target).attr('href');
        if (link != undefined) {
            if (link == "") {
                link = window.location.href.substring(0, window.location.href.indexOf("?"));
            }
            let stateObj = { id: "100" }; 
            window.history.pushState(stateObj, null, link); 
            handleQuery();
        }
    });

    $("a > span").on("click", function(event) {
        event.preventDefault();
        event.target.parentElement.click();
    })
    
    $(".navbar-brand").addClass("sticky-top");
    $(".navbar-brand").fadeIn();
    handleQuery();
});

function handleQuery() {
    query = window.location.search;
    window.navData = $('a[href="' + query + '"').attr("data-navigator");
    query = query.substr(1);
    pages = {
        "" : "home.htm",
        "apply" : "applyPassport.htm",
        "renew" : "renewPassport.htm",
        "status" : "checkStatus.htm",
        "profile" : "editProfile.htm",
        "logout" : "logout.htm"
    }
    page = pages[query];
    if (window.outerWidth <= 767 && $("#navToggler").attr("aria-expanded") == "true") {
        $("#navToggler").click();
    }
    loadPage(page)
}

function loadPage(url) {
    $(".loader-container").fadeIn(function() {
        verifyCookie(function() {
            getUserScreenName(function() {
                $("#mainContainer").load("pages/" + url, function(responseText, textStatus) {
                    if (textStatus == "error") {
                        $("#mainContainer").html("");
                        $(".loader-container").fadeOut();
                    } else {
                        try {
                            onPageLoad(function() {
                                $(".loader-container").fadeOut();
                            });
                        } catch {
                            $(".loader-container").fadeOut();
                        }                    
                    }
                    changeActiveLinkState();
                });
            });
            getUserApplicationStatus(function(status) {
                switch (status) {
                    case 'pending':
                        $("#applyBtn").parent().css("display", "none");
                        $("#checkStatusBtn").parent().css("display", "initial");
                        $("#renewBtn").parent().css("display", "none");
                    break;
                    case 'rejected':
                        $("#applyBtn").parent().css("display", "initial");
                        $("#checkStatusBtn").parent().css("display", "none");
                        $("#renewBtn").parent().css("display", "none");
                    break;
                    case 'verification':
                        $("#applyBtn").parent().css("display", "none");
                        $("#checkStatusBtn").parent().css("display", "initial");
                        $("#renewBtn").parent().css("display", "none");
                    break;
                    case 'approved':
                        $("#applyBtn").parent().css("display", "none");
                        $("#checkStatusBtn").parent().css("display", "none");
                        $("#renewBtn").parent().css("display", "none");
                    break;
                    case false:
                        $("#renewBtn").parent().css("display", "none");
                        $("#checkStatusBtn").parent().css("display", "none");
                        $("#applyBtn").parent().css("display", "initial");
                    break;
                }
            });
            getUserPassportNumber();
        });
    });
}

function changeActiveLinkState() {
	$("a.nav-link.active").removeClass("active");
    $("a > span:contains('" + window.navData + "')").parent().addClass("active");
}

function updateTime() {
	date = new Date()

	dd = date.getDate()
	dd < 10 ? dd = "0" + dd : dd =  dd;
	MM = date.getMonth() + 1;
	// add leading zero
	MM < 10 ? MM = "0" + MM : MM = MM;
	yy = date.getFullYear();
	dateField.innerHTML = dd + "/" + MM + "/" + yy;

	hh = date.getHours();
	// convert to 12-hour format
	hh > 12 ? hh = hh - 12 : hh = hh;
	// add leading zero
	hh < 10 ? hh = "0" + hh : hh = hh;

	mm = date.getMinutes();
	mm < 10 ? mm = "0" + mm : mm = mm;

	tt = "";
	date.getHours() >= 12 ? tt = "pm" : tt = "am";

	timeField.innerHTML = hh + ":" + mm + " " + tt;
}

function getUserScreenName(callback) {
    let screenName = '';
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/getDetails.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Cache-Control', 'no-cache');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let responseArray = JSON.parse(this.responseText);
            let result = responseArray['result'];
            if (result != '') {
                window.screenName = result;
                $(".profilename").html(window.screenName);
                callback();
            } else {
                msgTitle.innerHTML = "Unexpected Error";
                msgText.innerHTML = "There was an error satisfying your request. Please try again later.<br><b>Error Code:</b> SERVER_BAD_REQUEST";
                msgButton.onclick = function() {
                    window.location.href = "../";
                }
                setCookie('pas_auth', '', 0);
                $("#msgModal").modal({keyboard: false,backdrop: 'static'});
            }
        }
    };
    xhttp.send("role=applicant&info=screenName");
}

function getUserApplicationStatus(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/pas_backend/getDetails.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Cache-Control', 'no-cache');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let responseArray = JSON.parse(this.responseText);
            let result = responseArray['result'];
            if (result != undefined) {
                callback(result);
            }
        }
    };
    xhttp.send("role=applicant&info=applicationStatus");
}

function getUserPassportNumber() {
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
                $("#passportApplicationHeading").html("<span style='color: teal'>Your Passport Number:<br><b style='font-size: 16pt'>" + result + "</b></span>")
            }
        }
    };
    xhttp.send("role=applicant&info=passportNumber");
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

function showErrorMsg(title, msg) {
    msgTitle.innerHTML = title;
    msgText.innerHTML = msg;
    $("#msgModal").modal({keyboard: false,backdrop: 'static'});
}

function showMsgModal(title, msg) {
    msgTitle.innerHTML = title;
    msgText.innerHTML = msg;
    $("#msgModal").modal({keyboard: false,backdrop: 'static'});
}

function showConfirmationDialog(title, msg, confirmAction, cancelAction) {
    confirmTitle.innerHTML = title;
    confirmText.innerHTML = msg;
    confirmButton.onclick = confirmAction;
    cancelButton.onclick = cancelAction;
    $("#confirmationModal").modal({keyboard: false,backdrop: 'static'});
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

function goToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }