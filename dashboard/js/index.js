var navData = "";
$(document).ready(function () {
    updateTime();
    clk = setInterval(updateTime, 1000);
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
    loadPage(page)
}

function loadPage(url) {
    $(".loader-container").fadeIn(function() {
        $("#mainContainer").load("pages/" + url, function(responseText, textStatus) {
            if (textStatus == "error") {
                $("#mainContainer").html("");
                $(".loader-container").fadeOut();
            } else {
                onPageLoad(function() {
                    $(".loader-container").fadeOut();
                });
            }
            changeActiveLinkState();
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
	dd < 10 ? dd = "0" + dd : dd = "0" + dd;
	MM = date.getMonth();
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