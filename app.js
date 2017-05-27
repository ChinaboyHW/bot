var crawler = require('./crawler');
var models = require('./models');

const {
    Wechaty
} = require('wechaty') // import Wechaty from 'wechaty'
const bot = Wechaty.instance()

var WaitingForKeywords = {}

setInterval(() => {
    for (let key in WaitingForKeywords) {
        if (Date.now() - WaitingForKeywords[key].created > 60000) {
            delete WaitingForKeywords[key]
        }
    }
}, 20000)


bot.on('scan', (url, code) => console.log(`Scan QR Code to login: ${code}\n${url}`))
    .on('login', user => console.log(`User ${user} logined`))
    .on('message', onMessage)
    .init()

function onMessage(message) {
    console.log('###  onmessage')
        // console.log(`Message: ${message}`);
    console.log(message)
    const username = message.rawObj.FromUserName
    let parsedUrl = parseMessage(message)
    if (!parsedUrl) {
        let waitingForKeywords = WaitingForKeywords[message.rawObj.FromUserName]
        const content = message.rawObj.Content.trim()
        const keywords = content.split(' ')
        console.log(content)
        if (waitingForKeywords && keywords.length > 0) {
            console.log("insert ", message.rawObj.FromUserName, waitingForKeywords.url, keywords)
            models.insertURL(message.rawObj.FromUserName, waitingForKeywords.url, JSON.stringify(keywords))
            delete WaitingForKeywords[message.rawObj.FromUserName]

            crawler.addQueue(message.rawObj.FromUserName, message.rawObj.Url)
        }
        return
    }

    switch (parsedUrl.type) {
        case 1:
            models.insertURL(username, parsedUrl.url, parsedUrl.keywords)
                // models.insertURLContent(username, parsedUrl.url)
            crawler.addQueue(username, parsedUrl.url)
            break;
        case 49:
            // TODO Ask the user for keywords

            WaitingForKeywords[message.rawObj.FromUserName] = {
                    url: parsedUrl.url,
                    created: Date.now()
                }
                // Queue for once
            crawler.executeQueue(message.rawObj.FromUserName, message.rawObj.Url)
            message.say("如需持续关注，请输入关键字(以空格分隔)")
            break;
        default:

            break;
    }

    // var msssage = `Message: ${message}`;
    //   if (!/201|200/.test(String(code))) {
    //     const loginUrl = url.replace(/\/qrcode\//, '/l/')
    //     QrcodeTerminal.generate(loginUrl)

    // var http_url_catch;

    // if (msssage.indexOf("http") >= 0) {
    //     return
    //     var array = msssage.split(" ")
    //     if (array.length > 0) {
    //         if (array[0].indexOf("http" >= 0)) {
    //             models.insertURL(array[0], array[1])
    //         } else {
    //             models.insertURL(array[1], array[0])
    //         }
    //
    //     }
    //     bot.say("网址已收录")
    //     models.insertURL("关键字", msssage)
    //     crawler.exe_queue()
    // } else if (msssage.indexOf("list") >= 0 | msssage.indexOf("查询") >= 0) {
    //     var list = models.get_urls()
    //     console.log(list);
    //
    //
    //     bot.say(list)
    // } else if (msssage.indexOf("搜索") >= 0 | msssage.indexOf("search") >= 0) {
    //
    //     var list = models.get_urlcontent()
    //     bot.say(list)
    // }
}

const parseMessage = message => {
    let msgtype = message.type()
    let msgcontent = message.rawObj.Content.trim()
    console.log("msgtype:", msgtype)
    console.log("msgcontent:", msgcontent)
    if (msgtype === 49 && message.rawObj.Url) {
        console.log("app shares an url")
        return {
            type: msgtype,
            url: message.rawObj.Url
        }
    }
    if (msgtype === 1 && msgcontent.slice(0, 4) === 'http') {
        console.log("app shares an text with http")
        var msgParts = msgcontent.split(' ')
        let url = msgParts.shift()
        let keywords = JSON.stringify(msgParts)
        return {
            type: msgtype,
            url,
            keywords
        }
    }
}
