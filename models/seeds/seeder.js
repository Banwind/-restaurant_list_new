const restaurants = require('../restaurant_list') // 載入 Restaurant model
const restaurantsList = require('../../restaurant.json').results
const db = require('../../config/mongoose')


db.once('open', () => {
  for (let i=0; i < restaurantsList.length; i++) {
    restaurants.create({ ...restaurantsList[i]})
  }
  console.log('done')
})