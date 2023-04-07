const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport') // 載入設定檔，要寫在 express-session 以後
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')// 引用 body-parser
const methodOverride = require('method-override')
const routes = require('./routes') // 引用路由器
const flash = require('connect-flash')
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

usePassport(app) // 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
app.use(flash())
app.use((req, res, next) => {
  // res.locals 是 Express.js 幫我們開的一條捷徑，放在 res.locals 裡的資料，所有的 view 都可以存取。
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // Flash 中介軟體使用會話(session)中的資料，將其設置為本地變數 res.locals，以便在視圖中存取這些變數。
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

//監聽伺服器
app.listen(3000,()=>{
  console.log(`This is running on http://localhost:3000/`)
})