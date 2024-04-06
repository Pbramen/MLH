function validateAlpha(s) {
    var i;
    var n = s.length
    for (i = 0; i < n; i++) {
        let char = s.charCodeAt(i);
        if (
            !(char > 47 && char < 58) &&
            !(char > 64 && char < 91) &&
            !(char > 96 && char < 123)
        ) {
            return false;
        }    
    }
    return true; 
}

function validateNumber(s) {
    var i; 
    var n = s.length
    for (i = 0; i < n; i++){
        if (!(_isDigit(s.charCodeAt(i)))) {
            return false;
        }
    }
    return true;
}

function _isUpper(s) {
    return s > 64 && s < 91;
}
function _isLower(s) {
    return s > 96 && s < 123;
}
function _isDigit(s) {
    return s > 47 & s < 58;
}

export {validateAlpha, validateNumber}