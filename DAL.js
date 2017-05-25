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

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


const Url= sequelize.define('urls', {
    id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true 
  },
  keyword: {
    type: Sequelize.STRING,
        field:"keyword"
  },
  url: {
    type: Sequelize.STRING,
        field:"url"
  }
},
{
    tableName:"urls"
}
);

Url.findAll().then(urls => {
  console.log(urls)
})
Url.create({
    keyword: 'Hancock',
    url: 'urlurlurlurlurl'

  });
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
    primaryKey:true
  },
  content: {
    type: Sequelize.STRING
  }
},
{
    tableName:"urlcontent"
}
);


urlcontent.insertOrUpdate({
    //id: 2,
    content: '11'
  });
  
// urlcontent.sync({force: true}).then(() => {
//   // Table insertOrUpdate
//   return urlcontent.insertOrUpdate({
//     //id: 2,
//     content: '11'
//   });
// });

// urlcontent.findAll().then(urlcontent => {
//   console.log(urlcontent)
// })