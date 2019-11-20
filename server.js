const http = require('http')
const app = require('./app')

http.createServer(app).listen(9999,() => {
    console.log(`Backend Server is running on 9999..`)
})