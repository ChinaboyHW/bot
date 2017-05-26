var crawler = require('./crawler');
var dal = require('./DAL');

// msssage ="http"
// console.log(msssage.indexOf("http"));
// if(msssage.indexOf("http")>=0)
// {
//     // bot.say("网址已收录")
//       dal.inster_url()
// }

var list = dal.get_urls()
console.log(list);

var list = dal.get_urlcontent()
console.log(list);


//  crawler.exe_queue()
