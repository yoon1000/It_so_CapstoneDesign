const http = require('http')
const app = require('./app')

http.createServer(app).listen(1111,() => {
    console.log(`Backend Server is running on 1111..`)
})