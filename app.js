const express = require('express')
const exphbs = require('express-handlebars')
const restaurant = require('./models/restaurant_list')
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
  res.render('index', { restaurant })
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