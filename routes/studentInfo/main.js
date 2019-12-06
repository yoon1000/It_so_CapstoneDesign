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
router.post('/semester', function(req, res, next) {
    var sql = 'select subject_name from majorsubject where subject_name NOT IN (select subject_name from Student_majorsubject where id = ?) AND major = ? AND m.semester REGEXP(?)';
    mysqlDB.query(sql, [req.body.id, req.body.major, req.body.semester], function(error, result) {
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

/*졸업요건 중 비교과 졸업요건 가져오기
* 어느 학과인지 어느 학교인지 해당 유저의 졸업년도 알아야 함*/
router.post('/required_nonSubject', function(req, res, next) {
    var year = req.body.num.substring(0,4);
    console.log(year);
    var sql = 'select language_grade from Graduation_requirement where major = ? AND admission_num = ?';
    mysqlDB.query(sql, [req.body.major, year],function(error, language_grade) {
        if(error == null) {
            console.log(language_grade);
            res.json({
                "code" : 200,
                "result" : language_grade
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


/*졸업요건 중 비교과 졸업요건 가져오기
* 어느 학과인지 어느 학교인지 해당 유저의 졸업년도 알아야 함*/

router.post('/languageScore', function (req, res, next) {
    var languageScore = req.body.language;
    var id = req.body.id;
    var sql = 'update Student set language_grade = ? where id = ? ';
    mysqlDB.query(sql, [languageScore, id],function(error, languageScore) {
        if(error == null) {
            console.log(languageScore);
            res.json({
                "code" : 200,
                "result" : languageScore
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

})


router.post('/mainLanguageScore', function (req, res, next) {
    var id = req.body.id;
    var sql = 'select language_grade from Student where id = ?';
    mysqlDB.query(sql, id, function (error, result) {
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
})




module.exports = router;
