const http = require('http')
const app = require('./app')

http.createServer(app).listen(6666,() => {
    console.log(`Backend Server is running on 6666..`)
})