
//-----------------------------共通変数-----------------------------

var timer;
var zeroFlg;
var alarmObj;

//-----------------------------連動処理-----------------------------

//サンプル設定
function changeSample() {

    var changeSample = document.getElementById("option50");
    if (changeSample.value != "sampleOff") {
        var index = changeSample.selectedIndex;
        var opnValue = changeSample.options[index].text;
        document.getElementById("timerText").innerHTML = opnValue;
    }
}

//-----------------------------ボタン処理-----------------------------

//タイマー実行
function startClick() {

    zeroFlg = false;
    if (document.getElementById("timerText").innerHTML != "00:00:00") {
        document.getElementById("timerText").disabled = true;
        timer = setInterval("countDown()", 1000);
    }
}

//タイマー停止
function stopClick() {

    document.getElementById("timerText").disabled = false;
    if ((alarmObj != null)) {
        alarmObj.pause();
    }
    clearInterval(timer);
}

//タイマー時間設定
function timerClick() {

    try {
        var hour = document.getElementById("hour-Id").value;
        var minute = document.getElementById("minute-Id").value;
        var second = document.getElementById("second-Id").value;

        //空白判定
        if (emptyCheck(hour, "時間") == false) {
            return;
        }

        if (emptyCheck(minute, "分") == false) {
            return;
        }

        if (emptyCheck(second, "秒") == false) {
            return;
        }

        //時間範囲チェック
        if (limitCheck(hour, "hour-Id") == false) {
            return;
        }

        if (limitCheck(minute, "minute-Id") == false) {
            return;
        }

        if (limitCheck(second, "second-Id") == false) {
            return;
        }

        //時間をテキスト欄に反映
        document.getElementById("timerText").innerHTML = ("0" + hour).substr(-2) + ":"
            + ("0" + minute).substr(-2) + ":" + ("0" + second).substr(-2);

    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
    }
}

//カウントダウン関数
function countDown() {

    var timerText = document.getElementById("timerText").innerHTML;
    var timeArr = timerText.split(':');
    var hour = timeArr[0];
    var min = timeArr[1];
    var sec = timeArr[2];
    hour = Number(hour);
    min = Number(min);
    sec = Number(sec);

    if ((hour == "") && (min == "") && (sec == "")) {
        var errMsg = getXmlMsg("E007");
        alert(errMsg);
        document.getElementById("timerText").disabled = false;
        clearInterval(timer);
        return;
    }
    else {
        if (hour == "") hour = 0;
        hour = parseInt(hour);

        if (min == "") min = 0;
        min = parseInt(min);

        if (sec == "") sec = 0;
        sec = parseInt(sec);

        tmWrite((hour * 3600 + min * 60 + sec) - 1);
    }

    if (zeroFlg == true) {

        //選択オプション取得
        var opnData = getOption("EasyTimer");
        var opnMap = new Map();
        opnData.forEach(function (value, key) {
            opnMap.set(key, value);
        });

        var audio = selectOption("option01", opnMap);
        var sound = selectOption("option02", opnMap);

        if (audio != "audioOff" && sound != "soundOff") {
            setTimeout(alarmStart(sound), 1000);
        }
        return
    }
}

//残り時間を書き出す関数
function tmWrite(reTime) {

    reTime = parseInt(reTime);

    if (reTime <= 0) {
        reSet();
        zeroFlg = true;
        return;
    }
    else {
        var divisor = 0;
        var sTime = "0" + Math.floor(reTime / 3600);
        divisor = reTime % 3600;
        var sMinutes = "0" + Math.floor(divisor / 60);
        var sSeconds = "0" + divisor % 60;
        var timerText = sTime.substr(-2) + ":" + sMinutes.substr(-2) + ":" + sSeconds.substr(-2);
        document.getElementById("timerText").innerHTML = timerText;
    }
}

//タイマーを初期化
function reSet() {

    document.getElementById("timerText").innerHTML = "00" + ":" + "00" + ":" + "00";
    document.getElementById("timerText").disabled = false;
    clearInterval(timer);
}

//アラーム起動
function alarmStart(sound) {

    var alarmPath = "music/" + sound + ".mp3"
    alarmObj = new Audio(alarmPath);
    alarmObj.play();
}

//-----------------------------エラーチェック-----------------------------

//数値範囲チェック
function limitCheck(data, obj) {

    var flg = true
    var pList = new Array();
    var errMsg = getXmlMsg("E006");

    if ((obj == "hour-Id")) {
        if ((data >= 0 && data <= 23) == false) {
            pList.push("時:0~23");
            errMsg = dataReplace(errMsg, pList);
            alert(errMsg);
            flg = false
            return flg;
        }
    }

    if ((obj == "minute-Id") || (obj == "second-Id")) {
        if ((data >= 0 && data <= 59) == false) {

            pList.push("分または秒:0~59");
            errMsg = dataReplace(errMsg, pList);
            alert(errMsg);

            flg = false
            return flg;
        }
    }
    return flg;
}