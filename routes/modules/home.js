const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant_list')

//載入首頁
router.get('/',(req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' }) // desc
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

module.exports = router