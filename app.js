const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')// 引用 body-parser
const methodOverride = require('method-override')
const routes = require('./routes') // 引用路由器
const app = express()

require('./config/mongoose') //導入mongoose

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false, //當設定為true時，會在每一次與使用者互動時，強制將session更新到session store裡
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })) // 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(methodOverride('_method'))
app.use(routes)

//監聽伺服器
app.listen(3000,()=>{
  console.log(`This is running on http://localhost:3000/`)
})