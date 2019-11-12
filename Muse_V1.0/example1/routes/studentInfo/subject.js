var express = require('express');
var router = express.Router();

var mysqlDB = require('../mysql-db');

// /studentInfo/majorlist
/* 전공 클릭시 학과 리스트 가져오기 */
router.get('/majorlist', function(req, res, next) {
    var sql = 'select major from majorsubject;';

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

// /studentInfo/nonmajorlist
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



// /studentInfo/majorlist/
/* 학과 클릭시 해당학과의 전공과목 리스트 가져오기 */
router.get('/studentInfo/majorlist/', function(req, res, next) {
   mysqlDB.query('select * from table where major=?', major,function(err, result){
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




module.exports = router;