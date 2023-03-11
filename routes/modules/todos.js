const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");

// creat page
router.get("/new", (req, res) => {
  return res.render("new"); // 去拿new樣本(在views下建立new.hbs)
});

// creat todo
// app.post是Express 提供的路由方法，可以篩選出 HTTP 動詞為 POST 的請求
router.post("/", (req, res) => {
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
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.error(error));
});

// detail page
router.get("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log(error));
});

// edit page
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  const { name, done } = req.body;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});

// update To-do
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 匯出路由模組
module.exports = router;
