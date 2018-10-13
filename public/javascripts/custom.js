$(document).ready(function(){
    $('.btn-submit-keywords').click(function(e){
        var keyword = $('#keyword').val();
        if (!keyword) {
            alert('Please enter the keywords.');
            e.preventDefault();
        }
    });

    var values = $('.dataChart').data("values");
    var times = $('.dataChart').data("times");
    var tempKeyword = $('.dataChart').data("keyword");
    var tempKeywordStringify = JSON.stringify( $('.dataChart').data("keyword") );

    var series = [];
    
    if (tempKeywordStringify.indexOf(',') > -1) {
        keywordsx = tempKeywordStringify.replace('"', '');
        keywords = tempKeywordStringify.split(",").map(item => item.trim());
        keywordsLength = keywords.length;
/*
        // create multidimensional array
        var data = new Array(keywordsLength);
        for (var i = 0; i < keywordsLength; i++) {
            data[i] = new Array(values[0].length);
        }

        for (a = 0; a < keywordsLength; a++) {
            for (i = 0; i < values.length; i++) {
                data[a][i] = values[i];
            }
        }*/
        var data = [];
        var tempObject = {};

        for (x=0; x < keywordsLength; x++) {
            tempObject = {
                name: tempKeyword[x],
                data: values[x]
            }
            data.push(tempObject)
        }

        series = data
    } else {
        var data = [];
        for (i = 0; i < values.length; i++) {
            data.push([values[i]])
        }
        series = [{
            name: tempKeyword,
            data: data
        }];
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var timesArray = times[0].split(':');
    var dateNow = Date.UTC(yyyy, mm, dd, timesArray[0], timesArray[1]);

    Highcharts.chart('chart', {
        
        title: {
            text: tempKeyword
        },

        plotOptions: {
            series: {
                
                pointStart: dateNow,
                pointInterval: 16.8 * 60 * 60 
            }
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title: {
                text: 'Values'
            }
        },
        series: series
    });
})