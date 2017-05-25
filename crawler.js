// var Crawler = require("crawler");
// var jsdom = require('jsdom');

// var c = new Crawler({
//     jQuery: jsdom,
//     maxConnections : 100,
//     forceUTF8:true,
//   // incomingEncoding: 'gb2312',
//     // This will be called for each crawled page
//     callback : function (error, result, $) {
//       var urls = result.$;
//       console.log(urls)
//     }
// });

// c.queue('http://www.amazon.com'); 


var Crawler = require("crawler");

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($.text());
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('http://www.amazon.com');
