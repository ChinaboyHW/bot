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
var models = require('../models');

exports.addQueue = addQueue
exports.executeQueue = executeQueue

var Crawler = require("crawler");

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function(error, res, done) {
        console.log('crawler callback')
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            // console.log($.text());
            console.log(res.request.uri, res.statusCode)
                // models.insertURLContent($.text())
                //     const bot = Wechaty.instance()
                //     bot.on('message',  message =>  {
                //             })
                //             bot.message
        }
        done();
    }
});


function addQueue(username, url) {
    console.log("add quque", url)
    setInterval(() => {
        executeQueue(username, url)
    }, 5000);
}

function executeQueue(username, url, skipDuplicates) {
    console.log("exec queue", arguments)
        // c.queue(url)
    c.queue([{
        uri: url,
        callback: (err, res, done) => {
            if (err) {
                console.log('crawler err:', err)
            } else {
                console.log("got the crawl result for user", username)
                var $ = res.$;
                // models.insertURLContent(username, url, $.text())
            }
            done()
        }
    }]);
}

// Queue just one URL, with default callback
// function show1(){
//     trace("每隔1秒显示一次");
// }
// function show2(str){
//     addqueue(str);
// }
// setInterval(show1,1000);
