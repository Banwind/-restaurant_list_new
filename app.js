const express = require('express')
const exphbs = require('express-handlebars')
const restaurants = require('./models/restaurant_list')  //載入model
const mongoose = require('mongoose') // 載入 mongoose

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

//載入首頁
app.get('/',(req, res) => {
  restaurants.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

app.get('/restaurants/:restaurant_id',(req, res) => {
  const restaurant = restaurant.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant })
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