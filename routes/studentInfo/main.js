var express = require('express');
var router = express.Router();

var mysqlDB = require('../../config/mysql-db');


/* GET users listing. /main */
router.get('/', function(req, res, next) {
    res.render('main');
});


// /studentInfo/main/majorCredit
/* 전공학점 가져오기 */
router.get('/majorCredit', function(req, res, next) {
    var sql = 'select SUM(credit) as creditSum from Student_majorsubject;';
    mysqlDB.query(sql, [], function(error, creditSum) {
        if(error == null) {
            console.log(creditSum);
            res.json({
                "code" : 200,
                 creditSum
            });
        }
        else{
            console.log(error);
            res.json({
                "code" : 400,
                "result" : "failed"
            });
        }
    })
});

// /studentInfo/main/nonmajor
/* 교양과목학점 가져오기 */
router.get('/nonmajorCredit', function(req, res, next) {
    var sql = 'select SUM(credit) as creditSum from Student_nonmajorsubject;';
    mysqlDB.query(sql, [], function(error, creditSum) {
        if(error == null) {
            console.log(creditSum);
            res.json({
                "code" : 200,
                "result" : creditSum
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

// /studentInfo/main/semester
/* 전공그래프클릭시 학기별 수강하지 않은 전공과목 가져오기 */
router.post('/majorCredit/semester', function(req, res, next) {
    var semester = parseInt(req.body.semester);
    var sql = 'select subject_name from majorsubject where subject_name NOT IN (select subject_name from Student_majorsubject) AND semester = ?';
    mysqlDB.query(sql, semester, function(error, result) {
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
