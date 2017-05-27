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
        type: Sequelize.STRING,
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
    }
}, {
    tableName: "urls"
});



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
function getURLContent(keywords,func) {

    Project.findAll({ where: { content: [keywords] } }).then(projects => {
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



// // search for specific attributes - hash usage
// Project.findAll({ where: { name: 'A Project' } }).then(projects => {
//   // projects will be an array of Project instances with the specified name
// })

// search within a specific range
// Project.findAll({ where: { id: [1,2,3] } }).then(projects => {
//   // projects will be an array of Projects having the id 1, 2 or 3
//   // this is actually doing an IN query
// })

// Project.findAll({
//   where: {
//     id: {
//       $and: {a: 5}           // AND (a = 5)
//       $or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
//       $gt: 6,                // id > 6
//       $gte: 6,               // id >= 6
//       $lt: 10,               // id < 10
//       $lte: 10,              // id <= 10
//       $ne: 20,               // id != 20
//       $between: [6, 10],     // BETWEEN 6 AND 10
//       $notBetween: [11, 15], // NOT BETWEEN 11 AND 15
//       $in: [1, 2],           // IN [1, 2]
//       $notIn: [1, 2],        // NOT IN [1, 2]
//       $like: '%hat',         // LIKE '%hat'
//       $notLike: '%hat'       // NOT LIKE '%hat'
//       $iLike: '%hat'         // ILIKE '%hat' (case insensitive)  (PG only)
//       $notILike: '%hat'      // NOT ILIKE '%hat'  (PG only)
//       $overlap: [1, 2]       // && [1, 2] (PG array overlap operator)
//       $contains: [1, 2]      // @> [1, 2] (PG array contains operator)
//       $contained: [1, 2]     // <@ [1, 2] (PG array contained by operator)
//       $any: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
//     },
//     status: {
//       $not: false,           // status NOT FALSE
//     }
//   }
// })
