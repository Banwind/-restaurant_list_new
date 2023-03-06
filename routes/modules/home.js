const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant_list')

router.get('/:sort?', (req, res) => {
  const sort = req.params.sort || 'asc'

  let sortOption = { _id: sort === 'asc' ? 'asc' : 'desc' }
  if (sort === 'category') {
    sortOption = { category: 'asc', _id: 'asc' }
  } else if (sort === 'region') {
    sortOption = { region: 'asc', _id: 'asc' }
  } else if (sort === 'za') {
    sortOption = { name: 'desc', _id: 'asc' }
  } else if (sort === 'az') {
    sortOption = { name: 'asc', _id: 'asc' }
  }

  Restaurant.find()
    .lean()
    .sort(sortOption)
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

// 搜尋(這個功能目前有BUG)
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()

  //沒有輸入內容就返回首頁
  if (!keyword) {
    return res.redirect('/')
  }

  Restaurant.find({}).lean()
    .then((restaurants) => {
      const filterData = 
        restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword))
    
      res.render('index', { restaurant: filterData })
    })
    .catch(error => console.error(error))
})

module.exports = router