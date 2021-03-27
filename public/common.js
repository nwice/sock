function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function prettyNumber(n) {
    let nonNan = new Intl.NumberFormat('en-US').format(n);
    if  ( isNaN(n) ) {
        return n;
    }
    if ( n > 10000 && parseInt(n) != n ) {
        return prettyNumber(parseInt(n))
    }
    return nonNan
}