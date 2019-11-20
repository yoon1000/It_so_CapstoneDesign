var express = require('express');
var router = express.Router();

var mysqlDB = require('../../config/mysql-db');

//router.set('view engine', 'ejs');
//router.set('views', __dirname +'/views');


// /subject

// GET studentInfo listing./subject
router.get('/', function(req, res, next) {
    res.render('subject');
});

// /studentInfo/subject/majorlist
/* 전공 클릭시 학과 리스트 가져오기 */
router.get('/majorlist', function(req, res, next) {
    var sql = 'select major from Graduation_requirement;';

    mysqlDB.query(sql, [], function(error, major) {
        if(error == null) {
            console.log(major);
            res.json({
                "code" : 200,
                "result" : major
            });
        }
        else{
            console.log(error);
            res.json({
                "code" : 400,
                "result" : "failed"
            });
        }
    });

});

// /studentInfo/subject/nonmajorlist
/* 교양 클릭시 교양과목 리스트 가져오기 */
router.get('/nonmajorlist', function(req, res, next) {
    var sql = 'select subject_name from nonmajorsubject;';

    mysqlDB.query(sql, [], function(error, nonmajor) {
        if(error == null) {
            console.log(nonmajor);
            res.json({
                "code" : 200,
                "result" : nonmajor
            });
        }
        else{
            console.log(error);
            res.json({
                "code" : 400,
                "result" : "failed"
            });
        }
    });

});

// /studentInfo/subject/majorlist/major
/* 학과 클릭시 해당학과의 전공과목 리스트 가져오기 */
router.post('/majorlist/major', function(req, res, next) {
    var sql = 'select subject_name from majorsubject where major = ?';
    mysqlDB.query(sql, [req.body.major], function(error, result) {
        if(error == null) {
            res.json({
                "code" : 200,
                "result" : result
            });
        }
        else {
            console.log(error);
            res.json({
                "code" : 400,
                "result" : "failed"
            });
        }
    });
});




module.exports = router;
