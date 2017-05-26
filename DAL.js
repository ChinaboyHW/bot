exports.inster_url = inster_url
exports.insert_urlcontent = insert_urlcontent
exports.get_urls = get_urls
exports.get_urlcontent = get_urlcontent


//  var list =get_urlcontent()
//   console.log(list);

//var mysql  = require('mysql');  //调用MySQL模块
const Sequelize = require('sequelize');

const sequelize = new Sequelize('bot', 'admin', 'Sanrenzu123', {
    host: '138.68.14.193',
    //   dialect: 'mysql'|'sqlite'|'postgres'|'mssql',

    //   pool: {
    //     max: 5,
    //     min: 0,
    //     idle: 10000
    //   },

    // SQLite only
    // storage: 'path/to/database.sqlite'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
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
    keyword: {
        type: Sequelize.STRING,
        field: "keyword"
    },
    url: {
        type: Sequelize.STRING,
        field: "url"
    }
}, {
    tableName: "urls"
});


// var list =get_urls()
//     console.log(list);

function get_urls() {

    Url.findAll().then(urls => {
        return urls
    })
}

// Url.findAll().then(urls => {
//   console.log(urls)
// })
function inster_url(keyword, url) {
    Url.create({
        keyword: keyword,
        url: url
    });
}

// Url.sync({force: true}).then(() => {
//   // Table created
//   return Url.create({
//       id: 3,
//     keyword: 'Hancock',
//     url: 'urlurlurlurlurl'

//   });
// });



const urlcontent = sequelize.define('urlcontent', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    content: {
        type: Sequelize.STRING
    }
}, {
    tableName: "urlcontent"
});

function insert_urlcontent(content) {
    urlcontent.insertOrUpdate({
        content: content
    });

}

// urlcontent.sync({force: true}).then(() => {
//   // Table insertOrUpdate
//   return urlcontent.insertOrUpdate({
//     //id: 2,
//     content: '11'
//   });
// });
// var list =get_urls()
//     console.log(list);
function get_urlcontent() {

  urlcontent.findAll().then(urlcontent => {
    return  urlcontent
})}
// urlcontent.findAll().then(urlcontent => {
//   console.log(urlcontent)
// })



// // find multiple entries
// Project.findAll().then(projects => {
//   // projects will be an array of all Project instances
// })

// // also possible:
// Project.all().then(projects => {
//   // projects will be an array of all Project instances
// })

// // search for specific attributes - hash usage
// Project.findAll({ where: { name: 'A Project' } }).then(projects => {
//   // projects will be an array of Project instances with the specified name
// })

// // search within a specific range
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