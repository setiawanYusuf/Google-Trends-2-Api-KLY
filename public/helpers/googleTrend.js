var googleTrends = require('google-trends-api');

//CUSTOM PLUGIN
const arrayHelpers = require('./array');
const mathHelpers = require('./math');
const dateHelpers = require('./date');
const stringHelpers = require('./string');

//GOOGLE TRENDS
exports.init = function (req) {
    var keyword = req.body.keyword || req.query.keywords;
    var temp = stringHelpers.parseKeywords(keyword);
    keyword = temp['keywords'];
    var dataLength = temp['dataLength'];

    var result = new Array();
    result['keyword'] = keyword;
    result['dataLength'] = dataLength;

    return result;
}

exports.main = function (res, keyword, dataLength) {
    googleTrends.interestOverTime({
        keyword: keyword,
        startTime: new Date(Date.now() - (1 * 60 * 60 * 1000)),
        endTime: new Date(Date.now()),
        geo: 'ID',
        granularTimeResolution: true,
    }, function (err, results) {
        if (err) console.log('oh no error!', err);
        else
            var finalResult = parseDataGoogleTrend(dataLength, results);

        res.render('result', {
            title: 'Google Trends Trial',
            keyword: keyword,
            dataLength: dataLength,
            values: finalResult['values'],
            date: finalResult['date'],
            times: finalResult['times'],
            averageFirst: finalResult['averageFirst'],
            averageLast: finalResult['averageLast'],
            finalAverage: finalResult['finalAverage'],
            //FOR CHARTING
            keywordJson: keyword,
            valuesJson: JSON.stringify(finalResult['values']),
            timesJson: JSON.stringify(finalResult['times'])
        });
    });
}

function parseDataGoogleTrend (dataLength, results) {
    var arr = JSON.parse(results);
    var data = arr['default']['timelineData'];
    var times = [];
    var values = [];

    if (dataLength > 1) {
        var values = arrayHelpers.create2DArray(data.length, dataLength);
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (dataLength > 1) {
                values[key] = [];
                for (i = 0; i < dataLength; i++) {
                    var value = data[key]['value'][i];
                    values[key][i] = value;
                }
            } else {
                var value = data[key]['value'][0];
                values.push(value);
            }
            if (key == 0) {
                var date = dateHelpers.parseToDateOnly(data[key]['time']);
            }
            var time = dateHelpers.parseToTimeOnly(data[key]['time']);
            times.push(time);
        }
    }

    var finalResult = operateResults(dataLength, values, times, date);
    return finalResult;
}

function operateResults(dataLength, values, times, date) {
    if (dataLength > 1) {
        var finalResult = [];
        var valuesArray = [];
        var timesArray = [];
        var averageFirstArray = [];
        var averageLastArray = [];
        var finalAverageArray = [];

        for (i = 0; i < dataLength; i++) {
            var tempArray = new Array();

            for (key in values) {
                tempArray.push(values[key][i]);
            }
            var averageFirst = (tempArray.slice(0, 10).reduce(mathHelpers.add)) / 10;
            var length = tempArray.length;
            var lengthMinTen = (tempArray.length) - 10;
            var averageLast = (tempArray.slice(lengthMinTen, length).reduce(mathHelpers.add)) / 10;
            var finalAverage = (averageLast / averageFirst).toFixed(2);

            valuesArray[i] = tempArray;
            averageFirstArray[i] = averageFirst;
            averageLastArray[i] = averageLast;
            finalAverageArray[i] = finalAverage;
        }
        timesArray = times;

        finalResult['values'] = valuesArray;
        finalResult['times'] = timesArray;
        finalResult['date'] = date;
        finalResult['averageFirst'] = averageFirstArray;
        finalResult['averageLast'] = averageLastArray;
        finalResult['finalAverage'] = finalAverageArray;
    } else {
        var averageFirst = (values.slice(0, 10).reduce(mathHelpers.add)) / 10;
        var length = values.length;
        var lengthMinTen = (values.length) - 10;
        var averageLast = (values.slice(lengthMinTen, length).reduce(mathHelpers.add)) / 10;
        var finalAverage = (averageLast / averageFirst).toFixed(2);

        var finalResult = new Array();
        finalResult['values'] = Object.values(values);
        finalResult['times'] = Object.values(times);
        finalResult['date'] = date;
        finalResult['averageFirst'] = averageFirst;
        finalResult['averageLast'] = averageLast;
        finalResult['finalAverage'] = finalAverage;
    }

    return finalResult;
}