const Sequelize = require('sequelize');
const dbconfig = require('../conf/runtime.js').database


const sequelize = new Sequelize(dbconfig.db, dbconfig.user, dbconfig.password, {
    host: dbconfig.host,
    port: dbconfig.port
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        Url.sync({
            force: false
        }).then(() => {
            console.log("Url table created")
        });

        URLContent.sync({
            force: false
        }).then(() => {
            console.log("URLContent table created")
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Url = sequelize.define('urls', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    keywords: {
        type: Sequelize.TEXT,
        field: "keywords"
    },
    url: {
        type: Sequelize.TEXT,
        field: "url"
    },
    username: {
        type: Sequelize.STRING,
        field: "username"
    },
    userid: {
        type: Sequelize.STRING,
        field: "userid"
    },
    pushed_keywords: {
        type: Sequelize.TEXT
    }
}, {
    tableName: "urls"
});



function getURL(username, url, cb) {
    Url.find({
        where: {
            username,
            url
        }
    }).then(url => {
        cb(url)
    })

}

function insertURL(username, url, keywords) {
    Url.findOrCreate({
        where: {
            username,
            url
        },
        defaults: {
            keywords
        }
    }).spread((url, newlyCreated) => {
        if (!newlyCreated) {
            url.keywords = keywords
            url.save()
        }
    });
}

const URLContent = sequelize.define('urlcontent', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: Sequelize.TEXT
    },
    url: {
        type: Sequelize.TEXT,
    },
    username: {
        type: Sequelize.STRING
    }
}, {
    tableName: "urlcontent"
});

function insertURLContent(username, url, content) {
    URLContent.insertOrUpdate({
        username,
        url,
        content
    });
}

function getURLContent(keywords, cb) {
    console.log("get url content by keywords", keywords)
    let likeAry = []
    keywords.forEach((keyword) => {
        likeAry.push({
            content: {
                $like: "%" + keyword + "%"
            }
        })
    })
    let searchCondition = {
        where: likeAry
    }

    URLContent.findAll(searchCondition).then(contentlist => {
        console.warn("found:", contentlist.length)
        cb(contentlist)
    }, err => {
        console.error(err)
    })
}

function getURLs(username, cb) {
    console.log("get urls of ", username)
    Url.findAll({
        where: {
            username
        }
    }).then(urls => {
        console.log("Found:", urls.length)
        cb(urls)
    })
}


exports.insertURL = insertURL
exports.insertURLContent = insertURLContent
exports.getURLs = getURLs
exports.getURLContent = getURLContent
exports.getURL = getURL
