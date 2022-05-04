/*-------------------------------共通（変数）-------------------------------*/

var grobalMsgData = "";
var grobalTimeOut = 60000;

/*-------------------------------共通処理（ボタン）-------------------------------*/

//説明書を開く
function onExpLink(id) {
    
    window.open("manual/" + id);
}

//フォームデータ削除
function formReset(id) {

    if (document.getElementById(id) != null) {
        var areaForm = document.getElementById(id);
        areaForm.value = "";
    }
}

//クリップボードにデータコピー
function copyToClipBoard(id) {

    if (document.getElementById(id) != null) {
        try {
            var copyObj = document.getElementById(id);
            copyObj.select();
            document.execCommand("copy");
        } catch (e) {
            alert("クリップボードにコピーできませんでした" + "\n" + e.message);
        }
    }
}

//オプション内容を取得
function getOption(page) {

    try {
        var opnData = "";
        var items = "";
        switch (page) {
            case "JsonFmt":
                items = ["option01"];
                break;
            case "SqlFmt":
                items = ["option01", "option02", "option03", "option04", "option05"];
                break;
            case "DmlCreate":
                items = ["option01", "option02", "option03", "option04"];
                break;
            case "EasyTimer":
                items = ["option01", "option02"];
                break;
            default:
                alert("オプションを取得することが出来ません");
                return opnData;
        }
        var map = new Map();
        items.forEach(function (opn) {
            var opnObj = document.getElementById(opn);
            let options = opnObj.value;
            map.set(opn, options);
        });

        opnData = map
        return opnData;

    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
    }
}


//オプションの設定値を取得
function matchOption(opnName, opnDatas) {

    try {
        var opnData = "";
        var opnMap = new Map();
        opnMap.set("space0", 0);
        opnMap.set("space1", 1);
        opnMap.set("space2", 2);
        opnMap.set("space3", 3);
        opnMap.set("space4", 4);
        opnMap.set("comma", ",");
        opnMap.set("tab", "\t");
        opnMap.set("dbleqtn", "\"");
        opnMap.set("sleqtn", "\'");
        opnMap.set("insert", "insert");
        opnMap.set("update", "update");
        opnMap.set("delete", "delete");
        opnMap.set("semicolonOn", ";");
        opnMap.set("semicolonOff", "");

        var opnValue = opnDatas.get(opnName);
        opnData = opnMap.get(opnValue);

        return opnData;

    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
    }
}


//オプションを取得
function selectOption(opnName, opnDatas) {

    try {
        var opnValue = opnDatas.get(opnName);
        return opnValue;

    } catch (e) {
        alert("異常終了しました" + "\n" + e.message);
    }
}

/*-------------------------------共通処理（エラーチェック）-------------------------------*/

//空欄チェック
function emptyCheck(data, obj) {

    var flg = true
    if ((data == "") || (data == null)) {
        var errMsg = getXmlMsg("E002");
        var pList = new Array();
        pList.push(obj);
        errMsg = dataReplace(errMsg, pList);
        alert(errMsg);
        flg = false
        return flg;
    }
    return flg;
}

/*-------------------------------共通処理（メッセージ関連）-------------------------------*/

//メッセージをダウンロード
function getXmlDownLoad() {

    try {
        var msgMap = new Map();
        $.ajax({
            url: "xml/Message.xml",
            type: "GET",
            dataType: "XML",
            timeout: 60000,
            async: false
        })
            .done(function (resData, textStatus, jqXHR) {
                console.log("ステータス:" + jqXHR.status + " " + "ステータス内容:" + textStatus);

                $(resData).find("item").each(function () {
                    var msgData = new Object();
                    msgData.msgId = $(this).find("msgId").text();
                    msgData.message = $(this).find("message").text();
                    msgData.status = $(this).find("status").text();
                    msgMap.set(msgData.msgId, msgData);
                });
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log("XMLからエラーメッセージの取得に失敗しました");
                console.log("ステータス: " + jqXHR.status + " " + "ステータス内容: " + textStatus);
                console.log("errorThrown: " + errorThrown.message);

                alert("XMLからエラーメッセージの取得に失敗しました");
                alert("ステータス: " + jqXHR.status + " " + "ステータス内容: " + textStatus);
                alert("errorThrown: " + errorThrown.message);
            })
    } catch (e) {
        console.log("異常終了しました");
        console.log(e.message);

        alert("異常終了しました" + "\n" + e.message);
    } finally {
        return msgMap;
    }
}

//IDからメッセージを取得
function getXmlMsg(msgId) {

    try {
        var msg = "";
        if ((grobalMsgData == "") || (grobalMsgData == null) || grobalMsgData === "undefined") {
            grobalMsgData = "";
            grobalMsgData = getXmlDownLoad();
        }

        var toString = Object.prototype.toString
        if ("[object Map]" != toString.call(grobalMsgData)) {
            alert("メッセージオブジェクトの型が正しくありません");
        }

        if (grobalMsgData.has(msgId)) {

            msg = grobalMsgData.get(msgId).message;
        } else {
            alert("対象メッセージのkeyが存在しません");
        }

    } catch (e) {
        alert("異常終了しました" + e.message);
    } finally {
        return msg;
    }
}

//データ置換
function dataReplace(data, param) {
    
    let result = data
    for (var i = 0; i < param.length; i++) {
        let index = "{" + i + "}"
        result = result.replace(index, param[i])
    }
    return result
}