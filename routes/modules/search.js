const express = require('express')
const router = express.Router()
const Restaurants = require('../../models/restaurant_list')


// router.get('/', (req, res) => {
//   const keyword = req.query.keyword.trim().toLowerCase()

//   if (!keyword) {
//     return res.redirect('/')
//   }
//   return Restaurants.find()
//     .lean()
//     .then(restaurants => {
//       const filterData = restaurants.filter(
//         restaurant => restaurant.name.toLowerCase().includes(keyword) ||
//           restaurant.name_en.toLowerCase().includes(keyword) ||
//           restaurant.category.includes(keyword)
//       )
//       res.render('index', { restaurant: filterData,keyword })
//     })
//     .catch(error => console.error(error))
// })

router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim()

  if (!keyword) {
    return res.redirect('/')
  }
  
  // 在資料庫中使用正規表達式進行模糊搜尋
  const regex = new RegExp(keyword, 'i')
  return Restaurants.find({
    $or: [
      { name: { $regex: regex } },
      { name_en: { $regex: regex } },
      { category: { $regex: regex } }
    ]
  })
    .lean()
    .then(restaurants => {
      res.render('index', { restaurant: restaurants, keyword })
    })
    .catch(error => console.error(error))
})


module.exports = router