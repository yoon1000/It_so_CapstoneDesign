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
    // 시간표 다차원배열만들기(5*48)
    var timetableArray = new Boolean();
    timetableArray[0] = new Boolean();
    timetableArray[1] = new Boolean();
    timetableArray[2] = new Boolean();
    timetableArray[3] = new Boolean();
    timetableArray[4] = new Boolean();
    for(var j=0; j<5; j++){
        for(var k=0; k<48; k++){
            timetableArray[j][k] = false;
            // console.log("timetableArray: ", timetableArray);
        }
    }

    // 고른 과목들 배열
    var selectArray = new Array();
    var selecttimeArray = new Array();
    var iArray = new Array();


    console.log(req.body.id);
    console.log(req.body.semester);
    console.log(req.body.option);
    var sql = 'select o.required, o.subject_name, o.time\n' +
        'from Open_major_ as o \n' +
        'join majorsubject as m\n' +
        'on o.subject_name = m.subject_name\n' +
        'where o.subject_name NOT IN (select subject_name from Student_majorsubject where id= ?)\n' +
        'AND m.major = "소프트웨어학과"\n' +
        'AND m.semester REGEXP(\'[1-?]\') \n' +
        'AND o.time not REGEXP(?)\n' +
        'Order by o.required DESC, subject_name';

    mysqlDB.query(sql, [req.body.id,req.body.semester,req.body.option], function(error, result) {
        if(error == null) {
             console.log("result1: ", result);
            // console.log("resultLength: ", result.length);
            // console.log("resultTime: ", result[0].time);

            for(var i=0; i<result.length; i++) {//반환된 과목 수 만큼
                var split = result[i].time.split(","); //한 과목당 며칠인지
                console.log("split: ", split);
                var replaceTime = result[i].time.replace(/,/gi, "/");
                var split2 = replaceTime.split("/"); //한 과목의 time을 특수문자를 제외하고 그대로 array에 넣기
                console.log("split2: ", split2);
                var day = new Array();
                var start = new Array();
                var end = new Array();
                for (var j = 0; j < split.length; j++) {
                    //day: 요일을 숫자로(배열에 넣기위해)
                    if (split2[(3 * j)] == "월") {
                        day[j] = 0
                    } else if (split2[(3 * j)] == "화") {
                        day[j] = 1
                    } else if (split2[(3 * j)] == "수") {
                        day[j] = 2
                    } else if (split2[(3 * j)] == "목") {
                        day[j] = 3
                    } else if (split2[(3 * j)] == "금") {
                        day[j] = 4
                    }
                    console.log("day: ", day);
                    //시작시간(칸)
                    start[j] = parseInt(split2[(3 * j) + 1]);
                    console.log("start: ", start);
                    //끝나는 시간(칸)
                    end[j] = parseInt(split2[(3 * j) + 2]);
                    console.log("end: ", end);
                }

                var select = 0;
                for (var j = 0; j < split.length; j++) {//한요일당
                    // console.log("day: ", day[j]);
                    // console.log("start: ", start[j]);
                    // console.log("end: ", end[j]);

                    for (var k = start[j]; k < end[j]+1; k++) {//한칸당
                        //console.log("k: ", k);
                        console.log("timetableArray[day[j][k]: ", timetableArray[day[j]][k]);
                        if (timetableArray[day[j]][k] == false) {//겹치는 것이 없으면
                            if(k==end[j]){
                                select++;
                                console.log("select: ", select);
                                if(select==split.length){ //모든 요일 모든 시간을 비교해봤을 때 겹치지 않았을 경우
                                    //console.log("select: ", select);
                                    if(selectArray.includes(result[i].subject_name)){ //같은 과목이 이미 있을 때
                                        break;
                                    } else{
                                        for(var m = 0; m < split.length; m++){
                                            for (var n = start[m]; n < end[m]+1; n++){
                                                timetableArray[day[m]][n] = true; //해당 시간을 true로 바꿔주고
                                            }
                                        }
                                        selectArray.push(result[i].subject_name); //해당 과목 이름을 selectArray에 넣는다.
                                        selecttimeArray.push(result[i].time);
                                        iArray.push(parseInt(i));
                                        console.log("selectArray: ", selectArray);
                                    }
                                }
                            }
                        } else {
                            break;
                            console.log("selectArray: ", selectArray);
                        }
                    }
                }

                if(selectArray.length==5){
                    break;
                }
            }
            var result2 = new Array();
            for(var i=0; i<selectArray.length; i++){
                result2[i] = new Array();
            }
            for(var i=0; i<selectArray.length; i++){
                result2[i][0] = selectArray[i];
                result2[i][1] = selecttimeArray[i];
            }

            console.log("result2: ", result2);

           /// 두번째 추천 시간표!!
            var selectArray2 = new Array();
            var selecttimeArray2 = new Array();
            var iArray2 = new Array();

            for(var j=0; j<5; j++){
                for(var k=0; k<48; k++){
                    timetableArray[j][k] = false;
                }
            }

            for(var a=0; a<selectArray.length; a++){
                console.log(a);
                console.log(iArray.includes(a));

                if(iArray.includes(a)==false){
                    console.log(result[a].subject_name);
                    selectArray2.push(result[a].subject_name);
                    selecttimeArray2.push(result[a].time);
                    iArray2.push(a);
                    var split = result[a].time.split(","); //한 과목당 며칠인지
                    console.log("split: ", split);
                    var replaceTime = result[a].time.replace(/,/gi, "/");
                    var split2 = replaceTime.split("/"); //한 과목의 time을 특수문자를 제외하고 그대로 array에 넣기
                    console.log("split2: ", split2);
                    var day = new Array();
                    var start = new Array();
                    var end = new Array();
                    for (var j = 0; j < split.length; j++) {
                        //day: 요일을 숫자로(배열에 넣기위해)
                        if (split2[(3 * j)] == "월") {
                            day[j] = 0
                        } else if (split2[(3 * j)] == "화") {
                            day[j] = 1
                        } else if (split2[(3 * j)] == "수") {
                            day[j] = 2
                        } else if (split2[(3 * j)] == "목") {
                            day[j] = 3
                        } else if (split2[(3 * j)] == "금") {
                            day[j] = 4
                        }
                        console.log("day: ", day);
                        //시작시간(칸)
                        start[j] = parseInt(split2[(3 * j) + 1]);
                        console.log("start: ", start);
                        //끝나는 시간(칸)
                        end[j] = parseInt(split2[(3 * j) + 2]);
                        console.log("end: ", end);
                    }
                    for (var m = 0; m < split.length; m++) {
                        for (var n = start[m]; n < end[m] + 1; n++) {
                            timetableArray[day[m]][n] = true; //해당 시간을 true로 바꿔주고
                        }
                    }
                    console.log(selectArray2);
                }
            }
            for (var i = 0; i < result.length; i++) {//반환된 과목 수 만큼
                var split = result[i].time.split(","); //한 과목당 며칠인지
                console.log("split: ", split);
                var replaceTime = result[i].time.replace(/,/gi, "/");
                var split2 = replaceTime.split("/"); //한 과목의 time을 특수문자를 제외하고 그대로 array에 넣기
                console.log("split2: ", split2);
                var day = new Array();
                var start = new Array();
                var end = new Array();
                for (var j = 0; j < split.length; j++) {
                    //day: 요일을 숫자로(배열에 넣기위해)
                    if (split2[(3 * j)] == "월") {
                        day[j] = 0
                    } else if (split2[(3 * j)] == "화") {
                        day[j] = 1
                    } else if (split2[(3 * j)] == "수") {
                        day[j] = 2
                    } else if (split2[(3 * j)] == "목") {
                        day[j] = 3
                    } else if (split2[(3 * j)] == "금") {
                        day[j] = 4
                    }
                    console.log("day: ", day);
                    //시작시간(칸)
                    start[j] = parseInt(split2[(3 * j) + 1]);
                    console.log("start: ", start);
                    //끝나는 시간(칸)
                    end[j] = parseInt(split2[(3 * j) + 2]);
                    console.log("end: ", end);
                }

                var select = 0;
                for (var j = 0; j < split.length; j++) {//한요일당

                    for (var k = start[j]; k < end[j] + 1; k++) {//한칸당
                        //console.log("k: ", k);
                        console.log("timetableArray[day[j][k]: ", timetableArray[day[j]][k]);
                        if (timetableArray[day[j]][k] == false) {//겹치는 것이 없으면
                            if (k == end[j]) {
                                select++;
                                console.log("select: ", select);
                                if (select == split.length) { //모든 요일 모든 시간을 비교해봤을 때 겹치지 않았을 경우
                                    //console.log("select: ", select);
                                    if (selectArray2.includes(result[i].subject_name)) { //같은 과목이 이미 있을 때
                                        break;
                                    } else {
                                        for (var m = 0; m < split.length; m++) {
                                            for (var n = start[m]; n < end[m] + 1; n++) {
                                                timetableArray[day[m]][n] = true; //해당 시간을 true로 바꿔주고
                                            }
                                        }
                                        selectArray2.push(result[i].subject_name); //해당 과목 이름을 selectArray2에 넣는다.
                                        selecttimeArray2.push(result[i].time);
                                        iArray2.push(i);
                                        console.log("selectArray2: ", selectArray2);
                                    }
                                }
                            }
                        } else {
                            break;
                            console.log("selectArray2: ", selectArray2);
                        }
                    }
                }

                if (selectArray2.length == 5) {
                    break;
                }
            }
            var result3 = new Array();
            for (var i = 0; i < selectArray2.length; i++) {
                result3[i] = new Array();
            }
            for (var i = 0; i < selectArray2.length; i++) {
                result3[i][0] = selectArray2[i];
                result3[i][1] = selecttimeArray2[i];
            }
            console.log("selectArray2: ", selectArray2);
            console.log("selectTimeArray2: ", selecttimeArray2);

            /// 세번째 추천 시간표!!
            var selectArray3 = new Array();
            var selecttimeArray3 = new Array();
            for(var j=0; j<5; j++){
                for(var k=0; k<48; k++){
                    timetableArray[j][k] = false;
                }
            }

            for(var a=0; a<result.length; a++){
                console.log(a);
                console.log(iArray.includes(a));
                console.log(iArray2.includes(a));

                if(iArray.includes(a)==false && iArray2.includes(a)==false) {
                    console.log(result[a].subject_name);
                    if (selectArray3.includes(result[a].subject_name) == false) {
                        selectArray3.push(result[a].subject_name);
                        selecttimeArray3.push(result[a].time);
                        var split = result[a].time.split(","); //한 과목당 며칠인지
                        console.log("split: ", split);
                        var replaceTime = result[a].time.replace(/,/gi, "/");
                        var split2 = replaceTime.split("/"); //한 과목의 time을 특수문자를 제외하고 그대로 array에 넣기
                        console.log("split2: ", split2);
                        var day = new Array();
                        var start = new Array();
                        var end = new Array();
                        for (var j = 0; j < split.length; j++) {
                            //day: 요일을 숫자로(배열에 넣기위해)
                            if (split2[(3 * j)] == "월") {
                                day[j] = 0
                            } else if (split2[(3 * j)] == "화") {
                                day[j] = 1
                            } else if (split2[(3 * j)] == "수") {
                                day[j] = 2
                            } else if (split2[(3 * j)] == "목") {
                                day[j] = 3
                            } else if (split2[(3 * j)] == "금") {
                                day[j] = 4
                            }
                            console.log("day: ", day);
                            //시작시간(칸)
                            start[j] = parseInt(split2[(3 * j) + 1]);
                            console.log("start: ", start);
                            //끝나는 시간(칸)
                            end[j] = parseInt(split2[(3 * j) + 2]);
                            console.log("end: ", end);
                        }
                        for (var m = 0; m < split.length; m++) {
                            for (var n = start[m]; n < end[m] + 1; n++) {
                                timetableArray[day[m]][n] = true; //해당 시간을 true로 바꿔주고
                            }
                        }
                        console.log(selectArray3);
                    }
                }
            }
            for (var i = 0; i < result.length; i++) {//반환된 과목 수 만큼
                var split = result[i].time.split(","); //한 과목당 며칠인지
                console.log("split: ", split);
                var replaceTime = result[i].time.replace(/,/gi, "/");
                var split2 = replaceTime.split("/"); //한 과목의 time을 특수문자를 제외하고 그대로 array에 넣기
                console.log("split2: ", split2);
                var day = new Array();
                var start = new Array();
                var end = new Array();
                for (var j = 0; j < split.length; j++) {
                    //day: 요일을 숫자로(배열에 넣기위해)
                    if (split2[(3 * j)] == "월") {
                        day[j] = 0
                    } else if (split2[(3 * j)] == "화") {
                        day[j] = 1
                    } else if (split2[(3 * j)] == "수") {
                        day[j] = 2
                    } else if (split2[(3 * j)] == "목") {
                        day[j] = 3
                    } else if (split2[(3 * j)] == "금") {
                        day[j] = 4
                    }
                    console.log("day: ", day);
                    //시작시간(칸)
                    start[j] = parseInt(split2[(3 * j) + 1]);
                    console.log("start: ", start);
                    //끝나는 시간(칸)
                    end[j] = parseInt(split2[(3 * j) + 2]);
                    console.log("end: ", end);
                }

                var select = 0;
                for (var j = 0; j < split.length; j++) {//한요일당

                    for (var k = start[j]; k < end[j] + 1; k++) {//한칸당
                        //console.log("k: ", k);
                        console.log("timetableArray[day[j][k]: ", timetableArray[day[j]][k]);
                        if (timetableArray[day[j]][k] == false) {//겹치는 것이 없으면
                            if (k == end[j]) {
                                select++;
                                console.log("select: ", select);
                                if (select == split.length) { //모든 요일 모든 시간을 비교해봤을 때 겹치지 않았을 경우
                                    //console.log("select: ", select);
                                    if (selectArray3.includes(result[i].subject_name)) { //같은 과목이 이미 있을 때
                                        break;
                                    } else {
                                        for (var m = 0; m < split.length; m++) {
                                            for (var n = start[m]; n < end[m] + 1; n++) {
                                                timetableArray[day[m]][n] = true; //해당 시간을 true로 바꿔주고
                                            }
                                        }
                                        selectArray3.push(result[i].subject_name); //해당 과목 이름을 selectArray2에 넣는다.
                                        selecttimeArray3.push(result[i].time);
                                        console.log("selectArray3: ", selectArray3);
                                    }
                                }
                            }
                        } else {
                            break;
                            console.log("selectArray3: ", selectArray3);
                        }
                    }
                }

                if (selectArray3.length == 5) {
                    break;
                }
            }
            var result4 = new Array();
            for (var i = 0; i < selectArray3.length; i++) {
                result4[i] = new Array();
            }
            for (var i = 0; i < selectArray3.length; i++) {
                result4[i][0] = selectArray3[i];
                result4[i][1] = selecttimeArray3[i];
            }
            console.log("selectArray3: ", selectArray3);
            console.log("selectTimeArray3: ", selecttimeArray3);

            ///
            res.json({
                "code" : 200,
                "result1" : result2,
                "result2" : result3,
                "result3" : result4
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
