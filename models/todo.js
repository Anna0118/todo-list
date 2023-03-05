const mongoose = require("mongoose");

const Schema = mongoose.Schema; // 使用mongoose的Schema模組

const todoSchema = new Schema({
  // 建構一個新的Schema
  name: {
    type: String, // 資料型別是字串
    required: true, // 這是個必填欄位
  },
  done: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
