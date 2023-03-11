// 載入外部模組
const express = require("express");
const exphbs = require("express-handlebars"); // 載入樣版引擎Handlebars
const bodyParser = require("body-parser"); // 引用 body-parser
const methodOverride = require("method-override"); // 載入 method-override

// 載入自製模組
const routes = require("./routes"); // 引用路由器
require("./config/mongoose");

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

const app = express();
const port = 3000;

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" })); // set template engine
app.set("view engine", "hbs"); // 啟用樣版引擎
app.use(bodyParser.urlencoded({ extended: true })); // 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(methodOverride("_method")); // 設定每一筆請求都會透過 methodOverride 進行前置處理

app.use(routes); // 將 request 導入路由器

// 設定 port 3000
app.listen(port, () => {
  console.log("App is running on http://localhost:3000");
});
