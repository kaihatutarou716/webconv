
//-----------------------------共通（変数）-----------------------------

var imgWidth = 450;
var origin_w;
var origin_h;
var fixed_w;
var fixed_h;
var image;
var picFile;
var fileArea = document.getElementById("dragDropArea");
var fileInput = document.getElementById("fileInput");
var canvas = document.getElementById("previewArea");

//-----------------------------連動処理-----------------------------

//サンプル設定
document.getElementById("option50").addEventListener("change", e => {

    var changeSample = document.getElementById("option50").value;
    var sleImage = "";
    if (changeSample != "sampleOff") {
        canvasReset("previewArea");
        sleImage = "image/" + changeSample + ".jpg";
        picFile = new Object();
        picFile.name = changeSample + ".jpg";

        //画像をblob型に変換
        var xhr = new XMLHttpRequest();
        xhr.open("GET", sleImage, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function (e) {
            var arrayBuffer = this.response;
            var blob = new Blob([arrayBuffer], { type: "image/png" });

            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () {
                image = reader.result;
                drawImage(reader.result, 1);
            }
        };
        xhr.send();
    }
}, false)

//-----------------------------ボタン処理-----------------------------

//ドラッグオーバー
fileArea.addEventListener("dragover", function (evt) {
    evt.preventDefault();
    fileArea.classList.add("dragover");
});

//ドラッグリーブ
fileArea.addEventListener("dragleave", function (evt) {
    evt.preventDefault();
    fileArea.classList.remove("dragover");
});

//ドロップ
fileArea.addEventListener("drop", function (evt) {
    evt.preventDefault();
    fileArea.classList.remove("dragenter");
    var files = evt.dataTransfer.files;
    fileInput.files = files;
    dropPreview("onChenge", files[0]);
});

//ドラックANDドロップで画像表示
function dropPreview(event, f = null) {
    var file = f;
    if (file === null) {
        file = event.target.files[0];
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        image = reader.result;
        drawImage(reader.result, 1);
    }
}

/*ファイル選択*/
document.querySelector('input[type="file"]').onchange = function () {
    picFile = this.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(picFile);
    reader.onload = function () {
        image = reader.result;
        drawImage(reader.result, 1);
    }
}

//画像リサイズ
function imgResizg(nalWidth, nalHeight) {

    try {
        var imgHeight = nalHeight * (imgWidth / nalWidth);
        return imgHeight;

    } catch (e) {
        var errMsg = "異常終了しました" + "\n" + e.message
        alert(errMsg);
        return (errMsg);
    }
}

//モザイク度変更時
document.getElementById("slider").addEventListener("change", function (e) {
    let value = document.getElementById("output1").value;
    drawImage(image, Number(value));
})

//canvasデータ削除
function canvasReset(id) {

    if (document.getElementById(id) != null) {
        let obj = document.getElementById("fileInput");
        obj.value = "";
        let ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, fixed_w, fixed_h);
        picFile = "";
    }
}

//画像ダウンロード
function picDownLoad() {

    if (picFile != "") {
        let dlCanvas = document.createElement("canvas");
        dlCanvas.width = origin_w;
        dlCanvas.height = origin_h;
        dlCanvas.getContext("2d").drawImage(canvas, 0, 0, origin_w, origin_h);
        let picData = dlCanvas.toDataURL("image/png");

        let link = document.createElement("a");
        link.href = picData;
        link.download = picFile.name;
        link.click();
    }
}

//-----------------------------モザイク処理-----------------------------

function drawImage(url, k) {
    let ctx = canvas.getContext("2d")
    let image = new Image()
    image.src = url
    image.onload = () => {
        var scale = 1
        origin_w = image.width;
        origin_h = image.height;
        fixed_w = imgWidth;
        fixed_h = imgResizg(image.width, image.height);
        canvas.width = fixed_w
        canvas.height = fixed_h

        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, fixed_w, fixed_h);

        if (k > 1) {
            var i, j
            for (i = 0; i < canvas.width; i += k) {
                for (j = 0; j < canvas.height; j += k) {
                    blurColor(i, j, k, k)
                }
            }
            cutRemnant(0, 0, i - k, j - k)
        }
    }
}

function blurColor(x, y, w, h) {
    let ctx = canvas.getContext("2d")
    let r, g, b
    r = g = b = 0

    var src = ctx.getImageData(x, y, w, h);
    var dst = ctx.createImageData(w, h)

    for (var i = 0; i < src.data.length; i += 4) {
        r += src.data[i]
        g += src.data[i + 1]
        b += src.data[i + 2]
    }

    r /= src.data.length / 4
    g /= src.data.length / 4
    b /= src.data.length / 4

    r = Math.ceil(r)
    g = Math.ceil(g)
    b = Math.ceil(b)

    for (var i = 0; i < src.data.length; i += 4) {
        dst.data[i] = r
        dst.data[i + 1] = g
        dst.data[i + 2] = b
        dst.data[i + 3] = 255
    }

    ctx.putImageData(dst, x, y)
}

function cutRemnant(x, y, w, h) {
    let ctx = canvas.getContext("2d")

    var src = ctx.getImageData(x, y, w, h);
    var dst = ctx.createImageData(canvas.width, canvas.height)

    for (var i = 0; i < src.data.length; i += 4) {
        dst.data[i + 3] = 0
    }

    ctx.putImageData(dst, x, y)
    ctx.putImageData(src, x, y)
}

function resizeCanvas(width, height, func) {
    var img = new Image();
    img.onload = function () {
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        if (func) {
            func();
        }
    }
    img.src = canvas.toDataURL();
}