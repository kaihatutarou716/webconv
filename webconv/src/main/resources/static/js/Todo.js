//-----------------------------共通処理-----------------------------

//ソート処理
function sortJsonData() {

  var data = getJsonData();
  var sortData = getSortData();
  var sortValue = sortData[0].sortId;

  if (data) {

    //期限：昇順、ID：昇順順に表示
    if ((sortValue === undefined || sortValue === null) || (sortValue == 1)) {
      data.sort(function (a, b) {
        if (a.deadLine < b.deadLine) return -1;
        if (a.deadLine > b.deadLine) return 1;
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
      })

      //期限：降順、ID：昇順順に表示
    } else if (sortValue == 2) {
      data.sort(function (a, b) {
        if (a.deadLine < b.deadLine) return 1;
        if (a.deadLine > b.deadLine) return -1;
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
      })

      //状態：作業中、ID：昇順順に表示
    } else if (sortValue == 3) {
      data.sort(function (a, b) {
        if (a.state < b.state) return -1;
        if (a.state > b.state) return 1;
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
      })

      //状態：完了、ID：昇順順に表示
    } else if (sortValue == 4) {
      data.sort(function (a, b) {
        if (a.state < b.state) return 1;
        if (a.state > b.state) return -1;
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
      })
    }

    return data;
  }
}

//jsonデータ取得
function getJsonData() {
  
  var JsonData = "";
  JsonData = localStorage.getItem("todoList");

  if (JsonData) {
    JsonData = JSON.parse(JsonData);
  }
  return JsonData;
}

//sortデータ取得
function getSortData() {
  
  var sortData = "";
  sortData = localStorage.getItem("sortData");

  if (!sortData) {
    var array = [];
    var obj = new Object();
    obj.sortId = 1;
    array.push(obj);

    var setjson = JSON.stringify(array);
    localStorage.setItem("sortData", setjson);
    sortData = localStorage.getItem("sortData");
  }
  sortData = JSON.parse(sortData);
  return sortData;
}


//-----------------------------ボタン処理-----------------------------

//データ読み込む処理
function onLoad() {

  var JsonData = sortJsonData();
  if (JsonData) {

    //要素の初期化
    var tbodies = document.getElementsByTagName("tbody");
    for (var i = 0; i < tbodies.length; i++) {
      while (tbodies[i].rows.length > 0) {
        tbodies[i].deleteRow(0);
      }
    }

    //動的テーブル作成
    for (var j = 0; j < JsonData.length; j++) {

      //Id
      var dataId = document.createElement("input");
      dataId.setAttribute("type", "hidden");
      dataId.setAttribute("id", "dataId");
      dataId.value = JsonData[j].id;
      dataId.name = "dataId";

      //タスク
      var dataTask = document.createElement("td");
      dataTask.setAttribute("id", "task");
      dataTask.appendChild(document.createTextNode(JsonData[j].task));

      //期限
      var dataDeadLine = document.createElement("td");
      dataDeadLine.setAttribute("id", "deadLine");
      dataDeadLine.appendChild(document.createTextNode(JsonData[j].deadLine));

      //状態
      var dState = "";
      if (JsonData[j].state == 1) {
        dState = "作業中";
      } else if (JsonData[j].state == 2) {
        dState = "完了";
      }

      var dataState = document.createElement("td");
      dataState.setAttribute("class", "state");
      var stateButton = document.createElement("button");
      stateButton.setAttribute("id", "stateButton");
      stateButton.value = JsonData[j].id;
      stateButton.appendChild(document.createTextNode(dState));
      var span = document.createElement("span");
      span.setAttribute("id", "span");
      stateButton.appendChild(span);
      dataState.appendChild(stateButton);

      //削除ボタン
      var tdButton = document.createElement("td");
      tdButton.setAttribute("class", "button");
      var deleteButton = document.createElement("button");
      deleteButton.setAttribute("id", "deleteButton");
      deleteButton.value = JsonData[j].id;
      deleteButton.appendChild(document.createTextNode("削除"));
      tdButton.appendChild(deleteButton);

      //trに追加
      var tr = document.createElement("tr");
      tr.appendChild(dataId);
      tr.appendChild(dataTask);
      tr.appendChild(dataDeadLine);
      tr.appendChild(dataState);
      tr.appendChild(tdButton);

      document.getElementsByTagName("tbody")[0].appendChild(tr);
    }
  }
}

//ソート処理(期限）
$(function () {
  
  $(document).on("click", "#dieButton", function (e) {
    var JsonData = getJsonData();
    var sortData = getSortData();
    var sortValue = sortData[0].sortId;

    //1:昇順、2:降順
    if (sortValue == 1) {
      sortData[0].sortId = 2;
    } else {
      sortData[0].sortId = 1;
    }
    localStorage.setItem("sortData", JSON.stringify(sortData));
    location.reload();
  });
});

//ソート処理(ステータス）
$(function () {
  
  $(document).on("click", "#steButton", function (e) {
    var JsonData = getJsonData();
    var sortData = getSortData();
    var sortValue = sortData[0].sortId;

    //3:作業中、4:完了
    if (sortValue == 3) {
      sortData[0].sortId = 4;
    } else {
      sortData[0].sortId = 3;
    }
    localStorage.setItem("sortData", JSON.stringify(sortData));
    location.reload();
  });
});

//データ追加
function submitItem() {

  var FormTask = document.forms.inputForm_id.item.value;
  var FormCalendar = document.forms.inputForm_id.datepicker.value;

  //空白判定
  if (emptyCheck(FormTask, "タスク") == false) {
    return;
  }

  //空白判定
  if (emptyCheck(FormCalendar, "期限") == false) {
    return;
  }


  var JsonData = "";
  var maxId = 0;
  JsonData = getJsonData();

  var numArray = new Array();

  if (JsonData) {
    for (var j = 0; j < JsonData.length; j++) {
      numArray.push(JsonData[j].id);
    }
  }

  //Idは最大値+1を設定
  if (numArray.length >= 1) {
    maxId = (Math.max.apply(null, numArray)) + 1;
  } else {
    maxId = 1;
  }

  //データ作成
  var array = [];
  var obj = new Object();

  if (JsonData) {
    for (var j = 0; j < JsonData.length; j++) {
      obj = new Object();
      obj.id = JsonData[j].id;
      obj.task = JsonData[j].task;
      obj.deadLine = JsonData[j].deadLine;
      obj.state = JsonData[j].state;
      obj.memo = JsonData[j];
      array.push(obj);
    }
  }

  obj = new Object();
  obj.id = maxId;
  obj.task = FormTask;
  obj.deadLine = FormCalendar;
  obj.state = 1;
  obj.memo = "";
  array.push(obj);

  var setjson = JSON.stringify(array);
  localStorage.setItem("todoList", setjson);
  location.reload();
}

//ステータス更新処理
$(function () {
  
  $(document).on("click", "#stateButton", function (e) {
    var id = $(this).val();
    var JsonData = "";
    JsonData = getJsonData();

    //取得したidに対応するステータス値を変更
    for (var j = 0; j < JsonData.length; j++) {
      if (JsonData[j].id == id) {
        if (JsonData[j].state == 1) {
          JsonData[j].state = 2;
        } else if (JsonData[j].state == 2) {
          JsonData[j].state = 1;
        }
        break;
      };
    }
    localStorage.setItem("todoList", JSON.stringify(JsonData));
    location.reload();
  });
});

//データ削除処理
$(function () {

  //削除対象のid取得
  $(document).on("click", "#deleteButton", function (e) {
    var id = $(this).val();

    var JsonData = "";
    var i = -1;
    JsonData = getJsonData();

    for (var j = 0; j < JsonData.length; j++) {
      if (id == JsonData[j].id) {
        JsonData.splice(j, 1);
        break;
      }
    }
    localStorage.setItem("todoList", JSON.stringify(JsonData));
    location.reload();
  });
});