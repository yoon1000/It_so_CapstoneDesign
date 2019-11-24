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

//POST /studentInfo/subject/time
router.post('/time', function(req, res, next) {
    var sql = 'select time from Open_major_ where subject_name=?;';
    mysqlDB.query(sql, [req.body.subject_name], function(error, result) {
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

// /studentInfo/subject/majorlist
/* 전공 클릭시 학과 리스트 가져오기 */
router.get('/majorlist', function(req, res, next) {
    var sql = 'select distinct major from Graduation_requirement;';

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
router.get('/majorlist/major', function(req, res, next) {
    var sql = 'select subject_name from majorsubject where major = "소프트웨어학과"';
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

/*/studentInfo/subject/majorlist
클라이언트로 부터 받은 해당 학생의 학적정보 db에 반영하기*/
router.post('/majorlist', function (req, res){
     var id = req.body.id;
    //var subject_list = req.body.subject;//학생이 들은 과목들
    var length = Object.keys(subject_list).length;//과목의 개수
    var subject_list_toString = subject_list.toString();
    var query ="";
    // console.log(id);
    //console.log(sql);
    //String subject_toString;
    //console.log(subject_list.toString());
    //console.log(subject_list);

    // var sql = 'insert into Student_majorsubject ' +
    //     'select distinct s.id, s.school, s.major, s.num, m.subject_name, m.required, m.credit, m.semester '+
    //     'from Student as s '+
    //     'join majorsubject as m ' +
    //     'on s.major = m.major ' +
    //     'where s.id = ?';

    /*for (var i = 0; i < length; i++) {
        split = subject_list_toString.split(',');
        //console.log(split[i]);
    }*/
    //console.log(sql + '\''+ id + '\'' +  ' AND m.subject_name= ' +  '\''+ split[0] +'\''+ ';');
/*    for (var i = 0; i < length; i++) { // Object.keys(obj).length 로 반복문을 돌려서 value에 접근해도?
        var split = subject_list_toString.split(',');
        console.log(split[i]);
        var sql = 'insert into Student_majorsubject ' +
        'select distinct s.id, s.school, s.major, s.num, m.subject_name, m.required, m.credit, m.semester '+
        'from Student as s '+
        'join majorsubject as m ' +
        'on s.major = m.major ' +
        'where s.id = ? AND m.subject_name= ?';

        mysqlDB.query(sql, [id, split[i]], function (err, result) {// 아이디를 가지고 school, num, major를 받아온다
            console.log(split[i]+"insert 성공");
        });
    }//비동기 관련 문제 있는 for문*/
    // for(var i=0; i<length;i++){
    //     query += sql +  '\'' + id + '\'' +  ' AND m.subject_name= ' + '\''+split[i] + '\''+';'
    // }
    var sql = 'insert into Student_majorsubject' +
        ' select distinct s.id, s.school, s.major, s.num, m.subject_name, m.required, m.credit, m.semester' +
        ' from Student as s' +
        ' join majorsubject as m' +
        ' on s.major = m.major' +
        ' where s.id = ? AND (m.subject_name = ?'+' OR m.subject_name =? '+ ' OR m.subject_name = ? )'+';';

    mysqlDB.query(sql, [id,req.body.subject[0],req.body.subject[1],req.body.subject[2]], function(error, result) {
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


/*/studentInfo/subject/nonmajorlist
클라이언트로 부터 받은 해당 학생의 학적정보 db에 반영하기*/
router.post('/nonmajorlist', function (req, res){
    var id = req.body.id;
    var nonmajor_list = req.body.subject;//학생이 들은 과목들
    var length = Object.keys(nonmajor_list).length;//과목의 개수
    var query = "";
    var nonmajor_list_toString = nonmajor_list.toString();
    var split;
    for (var i = 0; i < length; i++) {
        split = nonmajor_list_toString.split(',');
        //console.log(split[i]);
    }

    var sql = 'insert into Student_nonmajorsubject'+' select distinct s.id, s.school, n.subject_name, s.num, n.credit'
    +' from Student as s'
    +' join nonmajorsubject as n'
    +' on s.school = n.school'
    +' where s.id = ?'+ ' AND (n.subject_name= ?'+' OR n.subject_name =?'+' OR n.subject_name =?)' +';';

    /*for(var i=0; i<length;i++){
        query += sql +  '\'' + id + '\'' +  ' AND n.subject_name= ' + '\''+split[i] + '\''+';'
        *///console.log(query);


    mysqlDB.query(sql, [id, req.body.subject[0],req.body.subject[1],req.body.subject[2] ], function(error, result) {
        if(error == null) {
            res.json({
                "code" : 200,
                "result" : "success"
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
