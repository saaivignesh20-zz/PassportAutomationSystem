function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function verifyCookie(success_callback) {
    pasAuth = getCookie('pas_auth');
    if (pasAuth != "") {
        // check role
        var decodedCookie = atob(pasAuth);
        var cookieInfo = JSON.parse(decodedCookie);
        var role = cookieInfo.role;
        if (role != 'applicant') {
            msgButton.onclick = function() {
                window.location.href = "../";
            }
            showErrorMsg("Access Denied", "You are not allowed to access this portal. This incident is reported.");
            return;
        }
        console.log(role);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/pas_backend/authenticate.php", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let responseArray = JSON.parse(this.responseText);
                let result = responseArray['result'];
                if (result == "valid") {
                    success_callback();
                } else if (result == "notactive") {
                    showFatalErrorMsg("Account Inactive", "The account is marked inactive.<br><br>This might have happened because either the Administrator has disabled your account or somewhere authentication went wrong.");
                } else {
                    showFatalErrorMsg("Session Expired", "You need to sign-in again.");
                }
            }
        };
        xhttp.send("role=applicant&validate=token");
    } else {
        if (window.location.href.indexOf("dashboard/") > -1) {
            msgTitle.innerHTML = "Log In Required";
            msgText.innerHTML = "You need to sign-in first.";
            msgButton.onclick = function() {
                window.location.href = "../";
            }
            $("#msgModal").modal({keyboard: false,backdrop: 'static'});
        }
    }   
}