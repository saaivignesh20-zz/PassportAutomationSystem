/* 
    SnackifyMessage - Message Display Script
    This script requires jQuery to run
*/
var counter = 0;
function showSnackMessage(message, timeout, options) {
    let optionClasses = "";
    
    let messageType = options['type'];
    let messageContainer = options['container']; // should be a HTMLElement object/#ID/.Class Identifier
    let fullWidth = options['fullWidth'];
    let showCloseBtn = options['showCloseButton'];
    let autoHide = options['autoHide'];

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

    optionClasses = messageType + " " + fullWidth;
        
    let snackHTML = `<div class="snackmsg ` + optionClasses + `" id="snackmsg` + counter +`">
                        <span class="snack-text">` + message + `</span>
                        <button class="snack-close ` + showCloseBtn + `" onclick="hideSnackMessage(` + counter + `)">&times;</button>
                    </div>`;

    $(messageContainer).append(snackHTML);
    $("#snackmsg" + counter).fadeIn();
    
    if (autoHide == undefined || autoHide == true) {
        setTimeout(hideSnackMessage, timeout, counter);
    }
    counter++;
}

function hideSnackMessage(counter) {
    $("#snackmsg" + counter).fadeOut(function() {
        $("#snackmsg" + counter).remove();
    });
}

function hideAllSnackMessages() {
    for (i = 0; i <= counter; i++) {
        $("#snackmsg" + i).fadeOut(function() {
            $("#snackmsg" + i).remove();
        });
    }
    counter = 0;
}