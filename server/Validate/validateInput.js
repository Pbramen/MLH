function validateQuery(s) {
    var i;
    var n = s.length
    for (i = 0; i < n; i++) {
        let char = s.charCodeAt(i);
        if (
            !(_isDigit(char)) &&
            !(_isUpper(char)) &&
            !(_isLower(char))
        ) {
            return false;
        }    
    }
    return true; 
}

/**
 * Checks if all elements in array are numbers.
 * Upon success, returns -1
 * @param  {...any} s array of strings that should be integers. 
 * @returns -1 on successs, else returns index of the first invalid element.
 */
function validateNumber(...s) {
    var i;
    var j;
    var n = s.length
    for (j = 0; j < n; j++) {
        var b = s[j].length;
        for (i = 0; i < b; i++) {
            console.log(s[j].charAt(i));
            if (!(_isDigit(s[j].charCodeAt(i)))) {
                return j;
            }
        }
    }
    return -1;
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

export {validateQuery, validateNumber}