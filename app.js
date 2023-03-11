// 載入相關模組
const express = require("express");
const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require("express-handlebars"); // 載入樣版引擎Handlebars
const bodyParser = require("body-parser"); // 引用 body-parser
// const Todo = require("./models/todo"); // 載入Todo model
const methodOverride = require("method-override"); // 載入 method-override

// 引用路由器
const routes = require("./routes");

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
app.use(methodOverride("_method")); // 設定每一筆請求都會透過 methodOverride 進行前置處理

app.use(routes); // 將 request 導入路由器

// 設定 port 3000
app.listen(port, () => {
  console.log("App is running on http://localhost:3001");
});
