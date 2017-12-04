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

function onMessage(message) {}
