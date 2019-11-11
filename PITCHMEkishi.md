## Node.js 超入門
#### ECL 輪読発表
##### 岸本悠希
---
## OUTLINE
#### ・クッキーの利用
#### ・超簡単掲示板を作ろう
#### ・expressを利用しよう
---
## クッキーの利用
---
* クッキーはwebブラウザに用意されてるもので、サーバーから送られた値を保管しておくための仕組み
* どうやってサーバー間とやりとりしてるの？？ 
  * 実は、「ヘッダー情報」として値をやりとりしている |
---
* しかし問題点が、、、
 * クッキーは保管できる値の種類が限られている |
---
```js
    <head> 
        <h1><%=title %></h1> 
    </head> 
    <div role="main"> 
        <p><%=content %></p> 
        <p><table style="width:400px;"> 
            <tr><th>伝言です! </th></tr> 
            <tr><td><%=data.msg %></td></tr> 
        </table></p> 
        <p>your last message:<%= cookie_data %></p> 
        <form method="post" action="/"> 
        <p>MESSAGE <input type="text" name="msg"> 
        <input type="submit" value="送信 "></p> 
    </div> 
```
@[10](<%= cookie_data %>というタグを追加して、cookie_dataという値を表示している)
---
```js
// クッキーの値を設定 
function setCookie(key, value, response) { 
    var cookie = escape(value); 
    response.setHeader('Set-Cookie', [key + '=' + cookie]); 
}
```
@[3](エスケープ処理・・・クッキーに保存できる形式に変換する)
@[4](指定のキーに設定して保存する。第二引数は配列['キー=値', 'キー=値'…])
---
```js
function getCookie(key, request) { 
    var cookie_data = request.headers.cookie != undefined ? 
        request.headers.cookie : ''; 
    var data = cookie_data.split(';'); 
    for(var i in data) { 
        if (data[i].trim().startsWith(key + '=')){ 
            var result = data[i].trim().substring(key.length + 1); 
            return unescape(result); 
        } 
    }
    return ''; 
}
```
@[2,3](クッキーの値を取り出す)
@[2,3](三項演算子・・・変数 = 条件 ? trueの値 : falseの値;)
@[4](クッキーを分解する)
@[5,6,7,8,9,10](アンエスケープしてreturn)
---
<img width="700" src="https://user-images.githubusercontent.com/56333428/66698529-c49b7b00-ed19-11e9-9496-b3cfadcf91c9.png">
---
<img width="400" src="https://user-images.githubusercontent.com/56333428/66698490-81d9a300-ed19-11e9-939a-02120da473c7.png">
<img width="400" src="https://user-images.githubusercontent.com/56333428/66698520-b2214180-ed19-11e9-8c11-2946b5a332ab.png">
---
##### まとめ
* クッキーの問題点
 * 保管できる値が限られている |
* クッキーに値を保存する際の形式を変換する処理
 * エスケープ処理 |
* 変数 = 条件 ? trueの値 : falseの値;
 * 三項演算子 |
---
## 超簡単掲示板を作ろう
---
##### 掲示板に必要なもの
* 投稿データをファイルに保存
* 自分のIDをローカルストレージに保管
---
* ローカルストレージには問題点が、、、
 * クライアント側でしか動かない！ |
---
```js
<head> 
    <meta http-equiv="content-type" 
        content="text/html; charset=UTF-8"> 
        <title> ミニ掲示板</title> 
        <link type="text/css" href="./style.css" rel="stylesheet"> 
        <script> 
        function init() { 
            var id = localStorage.getItem('id'); 
            if (id == null){ 
                location.href = './login'; 
            }
        document.querySelector('#id').textContent = 'ID:' + id; 
        document.querySelector('#id_input').value = id; 
    } 
```
@[8](ローカルストレージから値を取り出す)
@[9,10,11](値がなければログインページに移動)
@[12](ID:○○という形でテキストを表示させる)
@[13](valueに値を設定)
---
```js
<body onload="init();"> 
    <head> 
        <h1>掲示板</h1> 
    </head> 
    <div role="main"> 
        <p>※メッセージは最大10個まで保管されます。</p> 
        <form method="post" action="/"> 
            <p><span id="id"></span> 
            <input type="hidden" id="id_input" name="id" value=""><p> 
            <p><input type="text" name="msg"> 
            <input type="submit" value="送信"></p> 
```
@[9](valueに値を設定)
---
```js
<p><table style="width:85%;"> 
            <% for(var i in data) { %> 
                <%- include('3-18', {val:data[i]}) %> 
            <%}%> 
        </table></p> 
```
@[1,2,3,4,5](順に取り出し, includeを使い作成)
---
```js
<% if (val != ''){ %> 
<% var obj = JSON.parse(val); %> 
<tr> 
    <th style="width:100px;"><%= obj.id %></th><td><%= obj.msg %></td> 
</tr> 
<%} %>
```
@[1](空じゃないかチェック)
@[2](JSON形式のテキストを元にオブジェクトを生成)
---
```js
const index_page = fs.readFileSync('./3-17.ejs', 'utf8'); 
const login_page = fs.readFileSync('./3-19.ejs', 'utf8'); 
const style_css = fs.readFileSync('./style.css', 'utf8'); 

const max_num = 10; // 最大保管数 
const filename = 'mydata.txt'; // データファイル名 
var message_data; // ★データ 
readFromFile(filename); 
var server = http.createServer(getFromClient); 
```
@[5](保管するデータの最大量)
---
```js
// テキストファイルをロード 
function readFromFile(fname) { 
    fs.readFile(fname, 'utf8', (err, data) => { 
        message_data = data.split('\n'); 
    })
}
```
@[2,3,4,5,6](データを読み込み分割し配列に)
---
```js
function addToData(id, msg, fname, request) { 
    var obj = {'id': id, 'msg': msg}; 
    var obj_str = JSON.stringify (obj); 
    console.log('add data: ' + obj_str); 
    message_data.unshift (obj_str); 
    if (message_data.length > max_num) { 
        message_data.pop(); 
    }
    saveToFile(fname); 
}
```
@[2](送信されたデータをまとめている)
@[3](オブジェクトをJSON形式に変換)
@[5](配列の最後に値を追加)
@[6,7,8](メッセージデータが多ければ削除)
---
```js
// データを保存 
function saveToFile(fname) { 
    var data_str = message_data.join('\n'); 
    fs.writeFile(fname, data_str, (err) => { 
        if (err) { throw err; } 
    });
}
```
@[3](1つのテキストに変換)
@[4](ファイルに保存)
---
<img width="700" src="https://user-images.githubusercontent.com/56333428/66712501-81541180-edd8-11e9-8dbb-68c7ee0f1ea1.png">
---
<img width="400" src="https://user-images.githubusercontent.com/56333428/66712504-992b9580-edd8-11e9-8c26-933e13339e0a.png">
<img width="400" src="https://user-images.githubusercontent.com/56333428/66712507-a779b180-edd8-11e9-9ba7-76edf771764d.png">
---
##### まとめ
* クライアントごとに保存するものとしてクッキーの他に
 * ローカルストレージ |
* ローカルストレージの問題点 |
 * クライアント側でしか動かない |
---
## expressを利用しよう
---
expressとは
* Nodejsに独自に組み込み、アプリケーション開発を簡単に
* Nodejsに使い心地が似ている
* 比較的軽いフレームワーク
---
```js
var express = require('express') 
var app = express() 

app.get('/', (req, res) => { 
    res.send('Welcome to Express!') 
}) 

app.listen(3000, () => { 
    console.log('Start server port:3000')
})
```
@[1](expressのオブジェクトの用意)
@[2](アプリケーションオブジェクトの作成)
@[4,5,6](ルーティングの設定)
@[8,9,10](待ち受けの開始)
---
##### まとめ
* expressのオブジェクトの用意
 * var express = require('express') |
* ルーティングの設定 
 * app.get() |
* 待ち受けの開始
 * app.listen() |
---
## ご静聴ありがとうございました
