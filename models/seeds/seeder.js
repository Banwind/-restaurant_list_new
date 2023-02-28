const mongoose = require('mongoose')
const restaurant = require('../restaurant_list') // 載入 Restaurant model
const restaurantsList = require('../../restaurant.json').results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i=0; i < restaurantsList.length; i++) {
    restaurant.create({ ...restaurantsList[i]})
  }
  console.log('done')
})