const express = require('express')
const router = express.Router()
const Restaurants = require('../../models/restaurant_list')

router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()

  if (!keyword) {
    res.redirect('/')
  }

  return Restaurants.find()
    .lean()
    .then(restaurants => {
      const filterData = restaurants.filter(
        restaurant => restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.name_en.toLowerCase().includes(keyword) ||
          restaurant.category.includes(keyword)
      )
      res.render('index', { restaurant: filterData,keyword })
    })
    .catch(error => console.error(error))
})

module.exports = router