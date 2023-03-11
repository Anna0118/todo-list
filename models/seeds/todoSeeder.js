const Todo = require("../todo");
const db = require("../../config/mongoose");

db.on("error", () => {
  console.log("mongodb error!");
});

// 使空callback概念
db.once("open", () => {
  for (let i = 0; i < 10; i++) {
    Todo.create({
      name: `name-${i}`,
    });
    console.log("done");
  }
});
