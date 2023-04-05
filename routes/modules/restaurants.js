const express = require('express')
const router = express.Router()
const Restaurants = require('../../models/restaurant_list')

// 前往新增餐廳的頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 接住新增餐廳的資料
router.post('/', (req, res) => {
  const userId = req.user._id
  const Restaurant = new Restaurants({ ...req.body, userId })
  Restaurant.save((err) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Failed to add restaurant')
    }
    return res.redirect('/')
  })
})

// 瀏覽餐廳詳細資料
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurants.findOne({ _id, userId }) // 使用findOne才能串接多個條件
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

// 進入修改頁面，將原有資料傳入edit
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurants.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 將修改完的資訊回傳回資料庫並更新
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurants.findOne({ userId, _id })
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).send('Restaurant not found')
      }
      return Restaurants.findByIdAndUpdate( _id, req.body)
    })
    .then(()=> res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// 刪除資料
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurants.findOne({ _id, userId })
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).send('Restaurant not found')
      }
      return Restaurants.findByIdAndUpdate(id)
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))    
})

module.exports = router