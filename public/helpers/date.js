//Date
const moment = require('moment');

exports.parseToTimeOnly = function (date) {
    var time = moment(date*1000).format('HH:mm');
    return time;
}

exports.parseToDateOnly = function (date) {
    var date = moment(date * 1000).format('MMMM YYYY, DD');
    return date;
}