const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  name_en: {
    type: String,
  },
  category: {
    type: String, 
    required: true 
  },
  image: {
    type: String,
  },
  location: {
    type: String, 
    required: true 
  },
  phone: {
    type: String,
    required: true
  },
  google_map: {
    type: String, 
    required: true 
  },
  rating: {
    type: Number, 
    required: true 
  },
  description: {
    type: String, 
  }
})
module.exports = mongoose.model('restaurants', restaurantSchema)

// "id": 1,
// "name": "Sababa 沙巴巴中東美食",
// "name_en": "Sababa Pita Bar",
// "category": "中東料理",
// "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg",
// "location": "台北市羅斯福路三段 283 巷 17 號",
// "phone": "02 2363 8009",
// "google_map": "https://goo.gl/maps/BJdmLuVdDbw",
// "rating": 4.1,
// "description": "沙巴巴批塔是台灣第一家純手工批塔專賣店,只選用最新鮮的頂級原料,以及道地的中東家傳配方。"