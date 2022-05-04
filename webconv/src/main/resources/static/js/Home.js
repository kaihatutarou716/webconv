
//-----------------------------ボタン処理-----------------------------

//データ読み込む処理
function onLoad() {

    var array = [];
    var obj = new Object();
    obj.curPage = String(1);
    obj.disNum = String(10);
    array.push(obj);
    var opnJson = JSON.stringify(array);

    try {
        $.ajax({
            url: "updateInfo",
            type: "POST",
            contentType: "application/json",
            data: opnJson.toString(),
            timeout: grobalTimeOut,
        })
            .done(function (resData, textStatus, jqXHR) {
                console.log("ステータス:" + jqXHR.status + " " + "ステータス内容:" + textStatus);

                var parser = new DOMParser();
                var domResdata = parser.parseFromString(resData, "text/html");

                if (domResdata.querySelector("#errMsg").value != "") {

                    var errMsg = String(domResdata.querySelector("#errMsg").value);
                    console.log("異常終了しました");
                    console.log(errMsg);

                    alert("異常終了しました" + "\n" + errMsg);

                } else {

                    if (domResdata.querySelector("#histyData").value != "") {

                        var upContArr = "";
                        var tmpUpContArr = JSON.parse(String(domResdata.querySelector("#histyData").value))
                        upContArr = JSON.parse(String(upContArr.concat("[", tmpUpContArr, "]")))

                        //動的テーブル作成
                        for (var j = 0; j < upContArr.length; j++) {

                            //Id
                            var val_Id = document.createElement("input");
                            val_Id.setAttribute("type", "hidden");
                            val_Id.setAttribute("class", "val_Id");
                            val_Id.value = upContArr[j].id;
                            val_Id.name = "val_Id";

                            //バージョン
                            var val_Version = document.createElement("td");
                            val_Version.setAttribute("class", "val_Version");
                            val_Version.appendChild(document.createTextNode(upContArr[j].version));

                            //更新日
                            var val_UpdateDate = document.createElement("td");
                            val_UpdateDate.setAttribute("class", "val_UpdateDate");
                            val_UpdateDate.appendChild(document.createTextNode(upContArr[j].updateDate));

                            //更新内容
                            var val_UpdateConts = document.createElement("td");
                            val_UpdateConts.setAttribute("class", "val_UpdateConts");
                            val_UpdateConts.appendChild(document.createTextNode(upContArr[j].updateconts));

                            //trに追加
                            var tr = document.createElement("tr");
                            tr.appendChild(val_Id);
                            tr.appendChild(val_Version);
                            tr.appendChild(val_UpdateDate);
                            tr.appendChild(val_UpdateConts);

                            document.getElementsByTagName("tbody")[0].appendChild(tr);
                        }
                    }
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log("更新履歴の取得に失敗しました");
                console.log("ステータス: " + jqXHR.status + " " + "ステータス内容: " + textStatus);
                console.log("errorThrown: " + errorThrown.message);

                alert("更新履歴の取得に失敗しました");
                alert("ステータス: " + jqXHR.status + " " + "ステータス内容: " + textStatus);
                alert("errorThrown: " + errorThrown.message);
            });
    } catch (e) {
        console.log("異常終了しました");
        console.log(e.message);

        alert("異常終了しました" + "\n" + e.message);
    } finally {
        document.getElementById("histyData").value = "";
        document.getElementById("errMsg").value = "";
    }
}