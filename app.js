var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var subjectRouter = require('./routes/studentInfo/subject');
var mainRouter = require('./routes/studentInfo/main');
var timeTableRouter = require('./routes/timeTable/timeTable');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var mysqlDB = require('./config/mysql-db');
mysqlDB.connect(function (err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    } else {
        console.log("연결에 성공하였습니다.");
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/studentInfo/subject', subjectRouter);
app.use('/studentInfo/main', mainRouter);
app.use('/timeTable/timeTable', timeTableRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
