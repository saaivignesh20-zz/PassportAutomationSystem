/* 
    SnackifyMessage - Message Display Script
    This script requires jQuery to run
*/
var snackcounter = 0;
function showSnackMessage(message, timeout, options) {
    let optionClasses = "";
    
    let messageType = options['type'];
    let messageContainer = options['container']; // should be a HTMLElement object/#ID/.Class Identifier
    let fullWidth = options['fullWidth'];
    let showCloseBtn = options['showCloseButton'];
    let autoHide = options['autoHide'];
    let leftAlign = options['leftAlign'];
    let noMargin = options['noMargin'];

    switch (messageType) {
        case 'info':
            messageType = "snack-info";
            break;
        case 'warning':
            messageType = "snack-warning";
            break;
        case 'error':
            messageType = "snack-error";
            break;
        default:
            messageType = "snack-info";
    }

    if (fullWidth) {
        fullWidth = "snack-fullwidth";
    } else {
        fullWidth = "";
    }

    if (showCloseBtn) {
        showCloseBtn = "snack-close-visible";
    } else {
        showCloseBtn = "";
    }

    if (leftAlign) {
        leftAlign = "";
    } else {
        leftAlign = "center-text";
    }

    if (noMargin) {
        noMargin = "no-margin";
    } else {
        noMargin = "";
    }

    optionClasses = messageType + " " + fullWidth + " " + leftAlign + noMargin;
    console.log("snack no: " + snackcounter);
    let snackHTML = `<div class="snackmsg ` + optionClasses + `" id="snackmsg` + snackcounter +`">
                        <span class="snack-text">` + message + `</span>
                        <button class="snack-close ` + showCloseBtn + `" onclick="hideSnackMessage(` + snackcounter + `)">&times;</button>
                    </div>`;

    $(messageContainer).append(snackHTML);
    $("#snackmsg" + snackcounter).fadeIn();
    
    if (autoHide == undefined || autoHide == true) {
        setTimeout(hideSnackMessage, timeout, snackcounter);
    }
    snackcounter++;
}

function hideSnackMessage(snackcounter) {
    $("#snackmsg" + snackcounter).fadeOut(function() {
        $("#snackmsg" + snackcounter).remove();
    });
}

function hideAllSnackMessages() {
    for (i = 0; i <= snackcounter; i++) {
            $("#snackmsg" + i).remove();
    }
}