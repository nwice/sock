window.getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.prettyNumber = (n) => {
    let nonNan = new Intl.NumberFormat('en-US').format(n);
    if  ( isNaN(n) ) {
        return n;
    }
    if ( n > 10000 && parseInt(n) != n ) {
        return prettyNumber(parseInt(n))
    }
    return nonNan
}

window.prettyDiff = (n) => {
    if ( n / 1000000 >= 1000 ) {
        return parseInt(n / 1000000000) + '.' + ((n % 1000000000) / 10000000) + 'B'
    } else if ( n / 1000000 >= 1 ) {
        return parseInt(n / 1000000) + '.' + parseInt((n % 1000000) / 10000) + 'M'
    } else if ( n / 1000 >= 100 ) {
        return parseInt(n / 1000) + 'K'
    } else if ( n / 1000 >= 10 ) {
        return parseInt(n / 1000) + 'K'
    } else if ( n / 1000 >= 1 ) {
        return parseInt(n / 100 ) + 'K'
    } else if ( parseInt(n) == 0 ) {
        return ''
    } else if ( n < 1000 ) {
        return parseInt(n)
    } else {
        return n
    }
}