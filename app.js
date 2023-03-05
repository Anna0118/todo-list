// 載入相關模組
const express = require("express");
const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require("express-handlebars"); // 載入樣版引擎Handlebars
const bodyParser = require("body-parser"); // 引用 body-parser
const Todo = require("./models/todo"); // 載入Todo model

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// connest to mongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// set db
const db = mongoose.connection;
// 只要觸error就印出error訊息
db.on("error", () => {
  console.log("mongodb error");
});
db.once("open", () => {
  console.log("mongodb connected!");
});

const app = express();
const port = 3000;
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" })); // set template engine
app.set("view engine", "hbs"); // 啟用樣版引擎
app.use(bodyParser.urlencoded({ extended: true })); // 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理

// route setting
app.get("/", (req, res) => {
  // 拿到全部的todo資料
  Todo.find() // 從資料庫找出資料 (目前沒有傳入參數，所以會撈出整份資料)
    .lean() // 將ｍongoose的Model物件轉換成單純js物件(陣列物件)
    .sort({ _id: "asc" }) // desc
    .then((todos) => res.render("index", { todos })) // 將資料傳給index樣本
    .catch((error) => console.error(error)); // 錯誤處理
});

// creat page
app.get("/todos/new", (req, res) => {
  return res.render("new"); // 去拿new樣本(在views下建立new.hbs)
});

// creat todo
// app.post是Express 提供的路由方法，可以篩選出 HTTP 動詞為 POST 的請求
app.post("/todos", (req, res) => {
  const name = req.body.name; // 從 req.body 拿出表單裡的 name 資料

  // 作法二：從Todo產生編輯資料情境必須採用
  // const todo = new Todo({
  //   // 存入資料庫
  //   name,
  // });
  // return todo
  //   .save()

  // 作法一: 呼叫Todo物件直接新增資料
  return Todo.create({ name })
    .then(() => res.re.direct("/")) // 新增完成後導回首頁
    .catch((error) => console.error(error));
});

// detail page
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log(error));
});

// edit page
app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  const { name, done } = req.body;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});

// update To-do
app.post("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  const { name, done } = req.body;
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name;
      todo.done = done === "on";
      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});

// delete To-do
app.post("/todos/:id/delete", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 設定 port 3000
app.listen(port, () => {
  console.log("App is running on http://localhost:3001");
});
