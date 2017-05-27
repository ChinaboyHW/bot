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
const {
    Contact
} = require('wechaty') // import Wechaty from 'wechaty'

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


function addQueue(message, username, url) {
    console.log("add quque", url)
    setInterval(() => {
        executeQueue(message, username, url)
    }, 5000);
}

function executeQueue(message, username, url) {
    console.log("exec queue", arguments)
        // c.queue(url)
    c.queue([{
        uri: url,
        callback: (err, res, done) => {
            if (err) {
                console.log('crawler err:', err)
            } else {
                console.log("got the crawl result for user", username)
                const $ = res.$;
                const text = $.text()

                models.getURL(username, url, (urlRecord) => {
                    let keywords = JSON.parse(urlRecord.keywords) || []
                    let pushed_keywords = JSON.parse(urlRecord.pushed_keywords) || []
                    console.log("get keyworkds", keywords)
                    var needToPush = false
                    let keywordsFound = []
                    for (let i = 0; i < keywords.length; i++) {
                        let keyword = keywords[i]

                        if (text.indexOf(keyword) != -1) {
                            keywords.splice(i, 1)
                            pushed_keywords.push(keyword)
                            keywordsFound.push(keyword)
                            needToPush = true

                            console.log("we got key word", keyword, "save the url")
                        }
                    }
                    if (needToPush) {
                        models.insertURLContent(username, url, $.text())
                        const msg = "您特别关注的" + JSON.stringify(keywordsFound) + "已更新，网址：" + url
                        message.from().say(msg)
                        urlRecord.keywords = JSON.stringify(keywords)
                        urlRecord.pushed_keywords = JSON.stringify(pushed_keywords)
                        urlRecord.save()
                    }

                })
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
