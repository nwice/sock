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
    console.log('here:', nonNan);
    if isNaN(nonNan) return n;
    return nonNan
}