var express = require('express');
var router = express.Router();

//CUSTOM PLUGIN
var googleTrendHelpers = require('../public/helpers/googleTrend');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.query.keywords) {
    var result = googleTrendHelpers.init(req);
    googleTrendHelpers.main(res, result['keyword'], result['dataLength']);
  } else {
    res.render('index', {
      title: 'Google Trends Trial',
    });
  }
});

router.post('/engage', function (req, res, next) {
  var result = googleTrendHelpers.init(req);
  googleTrendHelpers.main(res, result['keyword'], result['dataLength']);
});

module.exports = router;
