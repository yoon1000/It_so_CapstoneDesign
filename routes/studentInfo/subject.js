var express = require('express');
var router = express.Router();

var mysqlDB = require('../../config/mysql-db');

//router.set('view engine', 'ejs');
//router.set('views', __dirname +'/views');


// /subject

/* GET studentInfo listing. /subject
router.get('/', function(req, res, next) {
    res.render(subject.ejs);
  });
*/

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
            console.log("nonmajor success");
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

// /studentInfo/subject/majorlist/:majorParam
/* 학과 클릭시 해당학과의 전공과목 리스트 가져오기 */
router.get('/majorlist/:major_chosen', function(req, res, next) {
    //res.send(req.params);

    var major_chosen = req.params.majorsubject;
    //console.log(major);
    //res.send(major_chosen);

    var sql = 'select subject_name from majorsubject where major = ?'
    mysqlDB.query(sql, major_chosen, function(err, subject_name){
        if(error == null) {
            console.log(subject_name);
            res.json({
                "code" : 200,
                "result" : subject_name
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
