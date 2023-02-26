const express = require('express')

const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
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

app.engine('handlebars', exphbs({defaultLayout: 'main'}))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/',(req, res) => {
  res.render('index', { restaurant : restaurantList.results })
})

app.get('/restaurants/:restaurant_id',(req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', {restaurant : restaurant})
})

app.get('/search',(req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const restaurant = restaurantList.results.filter( restaurant => { 
    return restaurant.name.toLowerCase().includes(keyword)
  })
  res.render('index', {restaurant : restaurant})
})

app.listen(port,()=>{
  console.log(`This is running on localhost:${port}`)
})