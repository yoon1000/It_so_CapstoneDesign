var express = require('express');
var router = express.Router();

var mysqlDB = require('../../config/mysql-db');


// /subject

// GET studentInfo listing./subject
router.get('/', function(req, res, next) {
    res.render('subject');
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
/* 학적정보추가에서 교양 클릭시 듣지않은 교양과목 리스트 가져오기 */
router.post('/nonmajorlist', function(req, res, next) {
    var sql = 'select subject_name from nonmajorsubject where subject_name NOT IN (select subject_name from Student_nonmajorsubject where id = ?)';
    mysqlDB.query(sql, [req.body.id], function(error, result) {
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

// /studentInfo/subject/majorlist/major
/* 학적추가에서 전공클릭시 전체 수강하지 않은 전공과목 가져오기 */
router.post('/majorlist/major', function(req, res, next) {
    console.log(req.body.id);
    var sql = 'select subject_name from majorsubject where subject_name NOT IN (select subject_name from Student_majorsubject where id = ?) AND major = ?';
    mysqlDB.query(sql, [req.body.id, req.body.major], function(error, result) {
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


router.post('/majorlist', function (req, res){
    var id = req.body.id;
    var subject_list = req.body.subject;//학생이 들은 과목들
    //var length = Object.keys(req.body.length).length;//과목의 개수
    var query ="";
    console.log(subject_list);

    var temp1 = subject_list.replace("[" ,"");
    //console.log(aa);
    var temp2 = temp1.replace(']',"");
    var temp3 = temp2.replace(/"/gi, "");
    //console.log(temp3);
    var split = temp3.split(',');


    var sql ='insert into Student_majorsubject' +
        ' select distinct s.id, s.school, s.major, s.num, m.subject_name, m.required, m.credit, m.semester' +
        ' from Student as s' +
        ' join majorsubject as m' +
        ' on s.major = m.major' +
        ' where s.id = ';


    for(var i=0; i<split.length;i++) {
        query += sql + '\'' + id + '\'' + ' AND m.subject_name = ' + '\'' + split[i] + '\'' + ';'
    }
    console.log(query);

    mysqlDB.query(query, [], function(error, result) {
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


/*/studentInfo/subject/StudentNonmajorlist
클라이언트로 부터 받은 해당 학생의 학적정보 db에 반영하기*/
router.post('/StudentNonmajorlist', function (req, res){
    var id = req.body.id;
    var nonmajor_list = req.body.subject2;//학생이 들은 과목들
    //var length = Object.keys(nonmajor_list).length;//과목의 개수
    var query = "";

    var temp1 = nonmajor_list.replace("[" ,"");
    var temp2 = temp1.replace(']',"");
    var temp3 = temp2.replace(/"/gi, "");
    var split = temp3.split(',');


    var sql = 'insert into Student_nonmajorsubject'+' select distinct s.id, s.school, n.subject_name, s.num, n.credit'
    +' from Student as s'
    +' join nonmajorsubject as n'
    +' on s.school = n.school'
    +' where s.id = ';


    for(var i=0; i<split.length;i++) {
        query += sql + '\'' + id + '\'' + ' AND n.subject_name = ' + '\'' + split[i] + '\'' + ';'
    }
    console.log(query);
    mysqlDB.query(query, [], function(error, result) {
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

/*/studentInfo/subject/completed_majorsubject
학생이 들은 전공과목 불러오기*/
router.post('/completed_majorsubject', function(req, res, next) {
    var sql = 'select subject_name from Student_majorsubject where id=?;';
    mysqlDB.query(sql, [req.body.id], function(error, result) {
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
    });

});


/*/studentInfo/subject/completed_majorsubject
학생이 들은 교양과목 불러오기*/
router.post('/completed_nonmajorsubject', function(req, res, next) {
    var sql = 'select subject_name from Student_nonmajorsubject where id=?;';
    mysqlDB.query(sql, [req.body.id], function(error, result) {
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
    });

});



/**
 * user가 들었던 <전공과목>을 삭제하는 api
 Student_majorsubject 에서 id와 삭제하고 싶은 과목 리스트(deleteMajorlist)를 받으면 삭제해준다.
 */
router.post('/deleteMajor', function(req, res, next) {
    var id = req.body.id;
    var subject_list = req.body.deleteMajorlist;//학생이 들은 과목들
    //var length = Object.keys(req.body.length).length;//과목의 개수
    var query ="";
    console.log(subject_list);

    var temp1 = subject_list.replace("[" ,"");
    //console.log(aa);
    var temp2 = temp1.replace(']',"");
    var temp3 = temp2.replace(/"/gi, "");
    //console.log(temp3);
    var split = temp3.split(',');

    var sql = 'delete from Student_majorsubject where id = ';

    for(var i=0; i<split.length;i++) {
        query += sql + '\'' + id + '\'' + ' AND subject_name = ' + '\'' + split[i] + '\'' + ';'
    }
    console.log(query);

    mysqlDB.query(query, [], function(error, result) {
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
    });

});

/**
 * user가 들었던 <교양과목>을 삭제하는 api
 * 클라이언트로부터 id(string), deleteNonmajorlist 가 오면 해당 과목을 지워준다.
 */
router.post('/deleteNonmajor', function(req, res, next) {
    var id = req.body.id;
    var subject_list = req.body.deleteNonmajorlist;//학생이 들은 과목들
    //var length = Object.keys(req.body.length).length;//과목의 개수
    var query ="";
    console.log(subject_list);

    var temp1 = subject_list.replace("[" ,"");
    //console.log(aa);
    var temp2 = temp1.replace(']',"");
    var temp3 = temp2.replace(/"/gi, "");
    //console.log(temp3);
    var split = temp3.split(',');

    var sql = 'delete from Student_nonmajorsubject where id = ';

    for(var i=0; i<split.length;i++) {
        query += sql + '\'' + id + '\'' + ' AND subject_name = ' + '\'' + split[i] + '\'' + ';'
    }
    console.log(query);

    mysqlDB.query(query, [], function(error, result) {
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
    });
});

module.exports = router;
