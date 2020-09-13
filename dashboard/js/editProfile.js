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