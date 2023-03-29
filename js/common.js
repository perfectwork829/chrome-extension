/**
 * written by Dzmitry P.  2021.06.21
 * Common Functions For Chrome Extension
 */

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function getToday (){
    var today = new Date();
    var date = today.getFullYear() + '-' + pad((today.getMonth()+1)) + '-' + pad(today.getDate());
    var time = pad(today.getHours()) + ":" + pad(today.getMinutes()) + ":" + pad(today.getSeconds());

    return (date + ' ' + time);
}

function unixToString (timestamp) {
    var date = new Date(timestamp);
    return (   pad(date.getMonth() + 1)) +
        "/" + pad(date.getDate()) +
        "/" + pad(date.getFullYear()) +
        " " + pad(date.getHours()) +
        ":" + pad(date.getMinutes()) +
        ":" + pad(date.getSeconds());
}