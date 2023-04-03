const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Data,
    default: Date.now //伺服器將註冊資料送給資料庫時，執行 Date.now 並產生當下的時間戳記。如果是Date.now()則會紀錄專案生成Schema時的時間
  }
})

module.exports = mongoose.model('User', userSchema)