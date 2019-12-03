var express = require('express');
var router = express.Router();

var mysqlDB = require('../../config/mysql-db');


/* GET users listing. /TimeTable */
router.get('/', function(req, res, next) {
    res.render('timeTable');
});


//timeTable/time
//월공강 금공강 옵션 해당 과목 불러오기
// 1.개설과목중에 2.전공과목의 학기와 아이디를 가져오고 3.사용자가 들은 과목은 빼고
// 4.전공필수만 5.소프트웨어학과만 6.학기가 내가 선택한 학기와 그 이전학기들까지 7.옵션(월공강)
router.post('/time', function(req, res, next) {
    console.log(req.body.id);
    console.log(req.body.semester);
    console.log(req.body.option);
    var sql = 'select o.subject_name, o.time\n' +
        'from Open_major_ as o \n' +
        'join majorsubject as m\n' +
        'on o.subject_name = m.subject_name\n' +
        'where o.subject_name NOT IN (select subject_name from Student_majorsubject where id= ?)\n' +
        'AND o.required = "전공필수"\n' +
        'AND m.major = "소프트웨어학과"\n' +
        'AND m.semester REGEXP(\'[1-?]\') \n' +
        'AND o.time not REGEXP(\'?\')';
    mysqlDB.query(sql, [req.body.id,req.body.semester,req.body.option], function(error, result) {
        if(error == null) {
            console.log(result);
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
