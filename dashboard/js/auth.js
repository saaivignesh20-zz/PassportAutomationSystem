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

function verifyCookie(callback) {
    pasAuth = getCookie('pas_auth');
    if (pasAuth != "") {
        /* pasAuthDecoded = atob(pasAuth);
        pasAuthCookieJSON = JSON.parse(pasAuthDecoded);
        console.log(pasAuthCookieJSON); */
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/pas_backend/authenticate.php", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('Cache-Control', 'no-cache');

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                let responseArray = JSON.parse(this.responseText);
                let result = responseArray['result'];
                if (result == 'valid') {
                    callback();
                } else {
                    msgTitle.innerHTML = "Session Expired";
                    msgText.innerHTML = "You need to sign-in again.";
                    msgButton.onclick = function() {
                        window.location.href = "../";
                    }
                    setCookie('pas_auth', '', 0);
                    $("#msgModal").modal("show");
                }
            }
        };
        xhttp.send("validate=token&cookie=" + pasAuth);
    } else {
        if (window.location.href.endsWith("dashboard/")) {
            msgTitle.innerHTML = "Log In Required";
            msgText.innerHTML = "You need to sign-in first.";
            msgButton.onclick = function() {
                window.location.href = "../";
            }
            $("#msgModal").modal("show");
        }
    }
    
}