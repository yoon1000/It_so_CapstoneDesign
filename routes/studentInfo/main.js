var express = require('express');
var router = express.Router();

var mysqlDB = require('../../mysql-db');

/* GET users listing. /users */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});



// /studentInfo/main/creditmajor
/* 전공학점 가져오기 */
router.get('/creditmajor', function(req, res, next) {
    var sql = 'select SUM(credit) as creditSum from Student_majorsubject;';
    mysqlDB.query(sql, [], function(error, creditSum) {
        if(error == null) {
            console.log(creditSum);
            res.json({
                "code" : 200,
                "result" : creditSum
            });
        }
        else{ // 사용자 ID가 중복되면
            console.log(error);
            res.json({
                "code" : 400,
                "result" : "failed"
            });
        }
    })
});

// /studentInfo/main/creditnonmajor
/* 교양과목학점 가져오기 */
router.get('/creditnonmajor', function(req, res, next) {
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

// /studentInfo/main/major
/* 전공그래프클릭시 학기별 전공과목 가져오기 */
router.get('/major', function(req, res, next) {
    var sql = 'select subject_name from majorsubject where subject_name NOT IN (select subject_name from Student_majorsubject) AND semester = ?;';
    mysqlDB.query(sql, [], function(error, nonmajor) {
        if(error == null) {
            console.log(credit);
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
    });
});


module.exports = router;