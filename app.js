const express = require('express')
const exphbs = require('express-handlebars')
const restaurants = require('./models/restaurant_list')  //載入model
const mongoose = require('mongoose') // 載入 mongoose
const bodyParser = require('body-parser')// 引用 body-parser

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

//載入首頁
app.get('/',(req, res) => {
  restaurants.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

//導向新增餐廳的頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//接住新增餐廳的資料(還需要Debug)
app.post('/restaurants', (req, res) => {
    const restaurant = new restaurants({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
  })

  restaurant.save((err) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Failed to add restaurant')
    }
    return res.redirect('/')
  })
})

//瀏覽餐廳詳細資料
app.get('/restaurants/:id',(req, res) => {
  const id = req.params.id
  return restaurants.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//進入修改頁面，將原有資料傳入edit
app.get('/restaurants/:id/edit',(req, res) => {
  const id = req.params.id
  return restaurants.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//將修改完的資訊回傳回資料庫並更新
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  
  return restaurants.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name,
      restaurant.name_en = req.body.name_en,
      restaurant.category = req.body.category,
      restaurant.image = req.body.image,
      restaurant.location =  req.body.location,
      restaurant.phone = req.body.phone,
      restaurant.google_map = req.body.google_map,
      restaurant.rating = req.body.rating,
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})


app.get('/search',(req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const restaurant = restaurant.results.filter( restaurant => { 
    return restaurant.name.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurant })
})

app.listen(3000,()=>{
  console.log(`This is running on localhost:3000`)
})