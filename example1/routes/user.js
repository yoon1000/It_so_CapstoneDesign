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
  var sql = 'insert into user(userID, pw, name, phone, gender) values (?,?,?,?,?);';
  mysqlDB.query(sql, [req.body.userID, req.body.pw, req.body.name, req.body.phone, req.body.gender], function(error, info) {
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
  var sql = 'select * from user where userID = ?';
  mysqlDB.query(sql, [req.body.userID], function(error, result) {
    if(error == null) {
      if(result.length > 0) {
        if(result[0].pw == req.body.pw) {
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


/* 회원 정보 수정 /users/modifyinfo */
router.post('/modifyinfo', function(req, res, next) {
  var sql = 'update user set userID=?, pw=?, name=?, phone=?, gender=? where userID=?';
  mysqlDB.query(sql, [req.body.newUserID, req.body.pw, req.body.name, req.body.phone, req.body.gender, req.body.oldUserID], function(error, result) {
    if(error == null){
      console.log(result);
      console.log('Modify Info success');
        res.json({
          "code" : 200,
          "result" : "success"
        });
    }
    else { // foreign key 에러 날때, 이미 존재 하는 아이디 일때
      console.log(error);
      res.json({
        "code" : 400,
        "result" : "failed"
      });
    }
  });
});





module.exports = router;
