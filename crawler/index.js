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

exports.addqueue = addqueue
exports.exe_queue = exe_queue

var Crawler = require("crawler");

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function(error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($.text());
            models.insertURLContent($.text())
                //     const bot = Wechaty.instance()
                //     bot.on('message',  message =>  {
                //             })
                //             bot.message
        }
        done();
    }
});


function addqueue(url) {
    setInterval(exe_queue, 5000, "5sec"); //上面已经将函数的setInterval方法介绍了。
}

function exe_queue() {
    c.queue('http://www.baidu.com');
}

// Queue just one URL, with default callback
// function show1(){
//     trace("每隔1秒显示一次");
// }
// function show2(str){
//     addqueue(str);
// }
// setInterval(show1,1000);
