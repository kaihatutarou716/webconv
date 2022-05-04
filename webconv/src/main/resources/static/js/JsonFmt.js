
//-----------------------------連動処理-----------------------------

//サンプル設定
function changeSample() {

    var changeSample = document.getElementById("option50").value;
    var sampleData = "";

    if (changeSample == "sample01") {
        formReset("exeBefore_Area");
        sampleData = [
            {
                "productId": 1,
                "productName": "TestProduct",
                "price": 12.500,
                "tags": ["home", "red"]
            }
        ];
        sampleData = JSON.stringify(sampleData[0], null, 0);
        document.getElementById("exeBefore_Area").value = sampleData;
    }
}

//-----------------------------ボタン処理-----------------------------

//フォーム内容を取得
function dataFormat(page, bfTxtAreaId, afTxtAreaId) {

    try {
        var bfTxtData = document.getElementById(bfTxtAreaId).value;

        //空白判定
        if (emptyCheck(bfTxtData, "json") == false) {
            return;
        }

        //選択オプション取得
        var opnData = getOption(page);
        var opnMap = new Map();
        opnData.forEach(function (value, key) {
            opnMap.set(key, value);
        });

        //Json判定
        if (is_Json(bfTxtData) == false) {
            return;
        }

        //Json整形
        var afTxtData = jsonFormat(opnMap, bfTxtData);

        //整形後のJsonを表示
        document.getElementById(afTxtAreaId).value = afTxtData;

    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
    }
}

//Json整形
function jsonFormat(opnMap, bfTxtData) {

    try {
        var indent = matchOption("option01", opnMap);
        var afTxtData = JSON.stringify(JSON.parse(bfTxtData), null, indent);

        return afTxtData;

    } catch (e) {

        var errMsg = "異常終了しました" + "\n" + e.message
        alert(errMsg);
        return (errMsg);
    }
}

//-----------------------------エラーチェック-----------------------------

//Json判定
function is_Json(data) {
    
    try {
        JSON.parse(data);
    } catch (e) {

        var errMsg = getXmlMsg("E003");
        alert(errMsg + "\n" + e);
        return false;
    }
    return true;
}

