//STRING
exports.parseKeywords = function (keywords) {
    var dataLength = 1;
    var temp = new Array();
    temp['keywords'] = keywords;

    if (keywords) {
        if (keywords.indexOf(',') > -1) {
            keywords = keywords.split(",").map(item => item.trim());
            dataLength = keywords.length;
            temp['keywords'] = Object.values(keywords);
        }
    }

    temp['dataLength'] = dataLength;

    return temp;
}