var mysql = require('mysql');

var connection = mysql.createConnection({
    host : '106.10.50.18',
    port : 18090,
    user : 'root',
    password : 'Test!@#123',
    database : 'muse',
    multipleStatements: true
})

module.exports = connection;