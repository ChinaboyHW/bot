 var crawler = require('./crawler');
 var dal = require('./DAL');

 const {
     Wechaty
 } = require('wechaty') // import Wechaty from 'wechaty'
 const bot = Wechaty.instance()

 bot.on('scan', (url, code) => console.log(`Scan QR Code to login: ${code}\n${url}`))
     .on('login', user => console.log(`User ${user} logined`))
     .on('message', message => {
         console.log(`Message: ${message}`);
         var msssage = `Message: ${message}`;
         //   if (!/201|200/.test(String(code))) {
         //     const loginUrl = url.replace(/\/qrcode\//, '/l/')
         //     QrcodeTerminal.generate(loginUrl)
         //   }
         if (msssage.indexOf("http") >= 0) {
             var array = msssage.split(" ")
             if (array.length > 0) {
                 if (array[0].indexOf("http" >= 0)) {
                     dal.inster_url(array[0], array[1])
                 } else {
                     dal.inster_url(array[1], array[0])
                 }

             }
             bot.say("网址已收录")
             dal.inster_url("关键字", msssage)
             crawler.exe_queue()
         } else if (msssage.indexOf("list") >= 0 | msssage.indexOf("查询") >= 0) {
             var list = dal.get_urls()
             console.log(list);

             bot.say(list)
         } else if (msssage.indexOf("搜索") >= 0 | msssage.indexOf("search") >= 0) {

             var list = dal.get_urlcontent()
             bot.say(list)
         }
     })
     .init()
