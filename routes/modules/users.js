const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
// const bcrypt = require('bcryptjs')
const bcryptUtil = require('../../utils/bcryptUtil')

// 進入登入頁面
router.get('/login', (req, res) => {
  const error = req.flash('error')
  res.render('login', { error })
})

// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 進入註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 進入登出頁面
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。') // 路由處理函數中，使用 req.flash() 方法將成功或失敗訊息存儲到會話(session)中。
  res.redirect('/users/login')
})

// 送出註冊資料
router.post('/register', (req, res) => {
  // 取得表單資料
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有訊息都是必填的' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符!'})
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  //檢查是否註冊
  User.findOne({ email }).then(user => {
    //如果已經註冊，就返回頁面
    if (user){
      errors.push({ message: '此信箱已被註冊過。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      }) 
    }
    // hashPassword必須要返回一個promise才能在後面使用.then()
    return bcryptUtil.hashPassword(password)
      .then(hash => {
        User.create({
          name,
          email,
          password: hash // 用雜湊值取代原本的使用者密碼
        })  
      })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })
  .catch(error => console.log(error))
})

module.exports = router