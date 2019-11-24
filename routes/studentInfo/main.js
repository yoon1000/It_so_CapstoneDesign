var express = require('express');
var router = express.Router();

var mysqlDB = require('../../config/mysql-db');


/* GET users listing. /main */
router.get('/', function(req, res, next) {
    res.render('main');
});

router.get('/required_majorCredit', function(req, res, next) {
    var sql = 'select distinct required_credit_major from Graduation_requirement where major = "소프트웨어학과";';
    mysqlDB.query(sql, [],function(error, result) {
        if(error == null) {
            console.log(result);
            res.json({
                "code" : 200,
                "result" : result
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

router.get('/required_nonmajorCredit', function(req, res, next) {
    var sql = 'select distinct required_credit_non_major from Graduation_requirement where major="소프트웨어학과";';
    mysqlDB.query(sql, [],function(error, result) {
        if(error == null) {
            console.log(result);
            res.json({
                "code" : 200,
                "result" : result
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

// /studentInfo/main/majorCredit
/* 전공학점 가져오기 */
router.post('/majorCredit', function(req, res, next) {
    var sql = 'select SUM(credit) as creditSum from Student_majorsubject where id=?;';
    mysqlDB.query(sql, [req.body.id],function(error, creditSum) {
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
    })
});

// /studentInfo/main/nonmajor
/* 교양과목학점 가져오기 */
router.post('/nonmajorCredit', function(req, res, next) {
    var sql = 'select SUM(credit) as creditSum from Student_nonmajorsubject where id=?;';
    mysqlDB.query(sql, [req.body.id], function(error, creditSum) {
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
