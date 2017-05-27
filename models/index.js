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
            force: true
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

function getURLContent(keywords, func) {

    Project.findAll({
        where: {
            content: [keywords]
        }
    }).then(projects => {
        //   // projects will be an array of Projects having the id 1, 2 or 3
        //   // this is actually doing an IN query
        func(contentlist)
    })
}

function getURLs(func) {
    Url.findAll().then(urls => {
        func(urls)
    })
}

// function getURLContent() {
//     URLContent.findAll().then(urlcontent => {
//         return urlcontent
//     })
// }

exports.insertURL = insertURL
exports.insertURLContent = insertURLContent
exports.getURLs = getURLs
exports.getURLContent = getURLContent
exports.getURL = getURL
