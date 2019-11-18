var express = require('express');
var router = express.Router();

var mysqlDB = require('../mysql-db');

// /users

/* GET users listing. /users */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* 회원 등록 /users/register */
router.post('/register', function(req, res, next) {
  var sql = 'insert into Student(id, password, name, school, num, major) values (?,?,?,?,?,?);';
  mysqlDB.query(sql, [req.body.id, req.body.password, req.body.name, req.body.school, req.body.num, req.body.major], function(error, info) {
    if(error == null) {
      console.log(info);
      res.json({
        "code" : 200,
        "result" : "success"
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

/* 로그인  /users/login */
router.post('/login', function(req, res, next) {
  var sql = 'select * from Student where id = ?';
  mysqlDB.query(sql, [req.body.id], function(error, result) {
    if(error == null) {
      if(result.length > 0) {
        if(result[0].password == req.body.password) {
          console.log('login success');
          res.json({
            "code" : 200,
            "result" : result
          });
        }
        else {
          console.log('Password does not match');
          res.json({
            "code" : 204,
            "result" : "Password does not match"
          });
        }
      }
      else {
        console.log('ID does not match');
        res.json({
          "code" : 204,
          "result" : "ID does not match"
        });
      }
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
