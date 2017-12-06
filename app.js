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
    .start()

function onMessage(message) {
    if (message.self()) {
        return
    }
    // console.log(message.from())
    // console.log(`Message: ${message}`);
    // console.log(message)
    const username = message.from().rawObj.NickName
    let parsedUrl = parseMessage(message)
    if (!parsedUrl) {
        let waitingForKeywords = WaitingForKeywords[username]
        const content = message.rawObj.Content.trim()
        const keywords = content.split(' ')
        console.log(content)
        if (waitingForKeywords && keywords.length > 0) {
            message.say("关键字" + JSON.stringify(keywords) + "已收录")

            // console.log("insert ", username, waitingForKeywords.url, keywords)
            models.insertURL(username, waitingForKeywords.url, JSON.stringify(keywords))
            delete WaitingForKeywords[username]

            crawler.addQueue(message, username, message.rawObj.Url)
        }
        return
    }
    console.log(parsedUrl)

    switch (parsedUrl.type) {
        case 1:
            if (parsedUrl.query) {
                models.getURLs(username, urls => {
                    let msg = ""
                    if (urls.length === 0) {
                        msg = "您未关注任何网址"
                    } else {
                        msg = "您共关注了" + urls.length + "个网址：\n"
                        urls.forEach(url => {
                            msg += url.url + "\n"
                        })
                    }
                    message.say(msg)
                })
            } else if (parsedUrl.search) {
                models.getURLContent(parsedUrl.keywords, function(list) {
                    let msg = ""
                    if (list.length === 0) {
                        msg = "没有包含该内容的网址"
                    } else {
                        msg = "共有" + list.length + "个网址包含您搜索的内容：\n"
                        list.forEach(content => {
                            msg += content.url + "\n"
                        })
                    }
                    message.say(msg)
                })
            } else {

                models.insertURL(username, parsedUrl.url, parsedUrl.keywords)
                    // models.insertURLContent(username, parsedUrl.url)
                crawler.addQueue(message, username, parsedUrl.url)
                message.say("关键字" + parsedUrl.keywords + "已收录")
            }
            break;
        case 49:
            // TODO Ask the user for keywords

            WaitingForKeywords[username] = {
                    url: parsedUrl.url,
                    created: Date.now()
                }
                // Queue for once
            crawler.executeQueue(message, username, message.rawObj.Url)
            models.insertURL(username, parsedUrl.url, '[]')
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
    // console.log(message)
}

const parseMessage = message => {
    let msgtype = message.type()
    let msgcontent = message.rawObj.Content.trim()
        // console.log("msgtype:", msgtype)
        // console.log("msgcontent:", msgcontent)
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

    if (msgtype === 1 && (msgcontent.indexOf('搜索') != -1 || msgcontent.indexOf('search') != -1)) {
        var msgParts = msgcontent.split(' ')
        msgParts.shift()
        let keywords = msgParts
        return {
            type: msgtype,
            search: true,
            keywords
        }
    }

    if (msgtype === 1 && (msgcontent.indexOf('查询') != -1 || msgcontent.indexOf('list') != -1)) {
        return {
            type: msgtype,
            query: true
        }
    }

}
