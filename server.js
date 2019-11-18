const http = require('http')
const app = require('./app')

http.createServer(app).listen(8888,() => {
    console.log(`Backend Server is running on 8888..`)
})