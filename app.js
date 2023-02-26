// 載入 express 並建構應用程式伺服器
const express = require("express");
const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require("express-handlebars"); // 載入樣版引擎Handlebars
// 引用 body-parser
const bodyParser = require("body-parser");

const Todo = require("./models/todo"); // 載入Todo model

const app = express();

// 建立一個叫hbs的樣版引擎, 傳入相關參數
// 指定副檔名為 .hbs，才能把預設的長檔名改寫成短檔名
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
// 啟用樣版引擎
app.set("view engine", "hbs");

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }));

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // 設定連線到 mongoDB

const db = mongoose.connection;
// 用on註冊監聽器，監聽error事件有沒有發生
// 只要觸error就印出error訊息
db.on("error", () => {
  console.log("mongodb error");
});
// 針對連線成功的open其情況
// 連線成功只會發生一次，所以特地用once，一但成功後，在執行callback以後就會解除監聽器
db.once("open", () => {
  console.log("mongodb connected!");
});

// 設定首頁路由
app.get("/", (req, res) => {
  // 拿到全部的todo資料
  Todo.find() // 從資料庫找出資料 (目前沒有傳入參數，所以會撈出整份資料)
    .lean() // 將ｍongoose的Model物件轉換成單純js物件(陣列物件)
    .then((todos) => res.render("index", { todos })) // 將資料傳給index樣本
    .catch((error) => console.error(error)); // 錯誤處理
});

app.get("/todos/new", (req, res) => {
  return res.render("new"); // 去拿new樣本(在views下建立new.hbs)
});

// 建立新的Todo
// app.post是Express 提供的路由方法，可以篩選出 HTTP 動詞為 POST 的請求
app.post("/todos", (req, res) => {
  const name = req.body.name; // 從 req.body 拿出表單裡的 name 資料

  // 作法二：從Todo產生產生編輯資料情境必須採用
  // const todo = new Todo({
  //   // 存入資料庫
  //   name,
  // });
  // return todo
  //   .save()

  // 作法一: 呼叫Todo物件直接心增資料
  return Todo.create({ name })
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.error(error));
});

// 設定 port 3000
app.listen(3001, () => {
  console.log("App is running on http://localhost:3001");
});
