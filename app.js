// 載入 express 並建構應用程式伺服器
const express = require("express");
const app = express();

const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require("express-handlebars"); // 載入樣版引擎Handlebars

// 建立一個叫hbs的樣版引擎, 傳入相關參數
// 指定副檔名為 .hbs，才能把預設的長檔名改寫成短檔名
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
// 啟用樣版引擎
app.set("view engine", "hbs");

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
  res.send("hello worod");
});

// 設定 port 3000
app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});
