var mysql = require('mysql');

var connection = mysql.createConnection({
    host : '101.101.165.82',
    port : 18081,
    user : 'root',
    password : 'mysql',
    database : 'muse'
})

module.exports = connection;