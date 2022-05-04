
//-----------------------------連動処理-----------------------------

//サンプル設定
function changeSample() {

    var changeSample = document.getElementById("option50").value;
    var sampleTable = "changelogs";
    var sampleData = "";
    var array = "";

    if (changeSample == "sample01") {
        formReset("exeBefore_Area");
        array = ["id,version,updatedate,updateconts", "1,1.0.0,2022/2/4,テスト1", "2,1.0.1,2022/2/4,テスト2"];
        sampleData = array.join("\n");
        document.getElementById("tbl_name").value = sampleTable;
        document.getElementById("exeBefore_Area").value = sampleData;
    }
    else if (changeSample == "sample02") {
        formReset("exeBefore_Area");
        array = ["id	version	updatedate	updateconts", "1	1.0.0	2022/2/4	テスト1", "2	1.0.1	2022/2/4	テスト2"];
        sampleData = array.join("\n");
        document.getElementById("tbl_name").value = sampleTable;
        document.getElementById("exeBefore_Area").value = sampleData;
    }
}

//-----------------------------ボタン処理-----------------------------

//フォーム内容を取得
function dataFormat(page, bfTxtAreaId, afTxtAreaId) {

    try {
        var tblName = document.getElementById("tbl_name").value;
        var bfTxtData = document.getElementById(bfTxtAreaId).value;

        //空白判定
        if (emptyCheck(tblName, "テーブル名") == false) {
            return;
        }

        //空白判定
        if (emptyCheck(bfTxtData, "データ") == false) {
            return;
        }

        //選択オプション取得
        var opnData = getOption(page);
        var opnMap = new Map();
        opnData.forEach(function (value, key) {
            opnMap.set(key, value);
        });

        //入力データチェック
        if (is_InputData(opnMap, bfTxtData) == false) {
            return;
        }

        var dml = matchOption("option01", opnMap);
        var sqlList = new Array();

        if (dml == "insert") {
            sqlList = insertCreate(tblName, opnMap, bfTxtData);
        }

        var afTxtData = "";
        if (sqlList => 1) {
            for (var i = 0; i < sqlList.length; i++) {
                afTxtData = afTxtData.concat(sqlList[i], "\n");
            }

            if (afTxtData.endsWith("\n")) {
                afTxtData = afTxtData.slice(0, -1);
            }

            //作成したDMLを表示
            document.getElementById(afTxtAreaId).value = afTxtData;
        }

    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
    }
}

//insert文作成
function insertCreate(tblName, opnMap, bfTxtData) {
    
    try {
        var insWrite = "INSERT INTO {0} ({1}) VALUES ({2})";
        var delimiter = matchOption("option02", opnMap);
        var encChr = matchOption("option03", opnMap);
        var semicolon = matchOption("option04", opnMap);
        var lineDatas = bfTxtData.split(/\n/);
        var sqlList = new Array();
        var lineData = "";
        var header = "";
        var data = "";

        for (var i = 0; i < lineDatas.length; i++) {
            lineData = "";
            var lineData = lineDatas[i];
            lineData = lineData.split(delimiter);

            if (i == 0) {
                header = "";
                for (var t = 0; t < lineData.length; t++) {
                    header = header.concat(lineData[t], ",");
                }

                if (header.endsWith(",")) {
                    header = header.slice(0, -1);
                }

            } else {

                data = "";
                for (var t = 0; t < lineData.length; t++) {
                    data = data.concat(encChr, lineData[t], encChr, ",");
                }

                if (data.endsWith(",")) {
                    data = data.slice(0, -1);
                }

                var pList = new Array();
                pList.push(tblName);
                pList.push(header);
                pList.push(data);

                var insData = dataReplace(insWrite, pList)

                if (semicolon == ";") {
                    insData = insData.concat(semicolon);
                }
                sqlList.push(insData);
            }
        }

        return sqlList;
    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
        return "";
    }
}

//-----------------------------エラーチェック-----------------------------

//エラーチェック
function is_InputData(opnMap, bfTxtData) {
    try {

        var delimiter = matchOption("option02", opnMap);
        var firstLine = 0;
        var lineDatas = bfTxtData.split(/\n/);

        //インサートデータ存在確認
        if (lineDatas.length == 1) {
            var errMsg = getXmlMsg("E005");
            alert(errMsg);
            return false
        }

        //列数とデータの個数が一致していることを確認
        for (var i = 0; i < lineDatas.length; i++) {

            var lineData = lineDatas[i];
            lineData = lineData.split(delimiter);

            if (i == 0) {
                firstLine = lineData.length;
            }

            if (firstLine != lineData.length) {

                //改行以外の場合
                if (lineData[0].trim()) {
                    var errMsg = getXmlMsg("E004");
                    var pList = new Array();
                    pList.push(i + 1);
                    errMsg = dataReplace(errMsg, pList);
                    alert(errMsg);
                    return false;
                }
            }
        }
        return true;
    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
        return false;
    }
}