const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得表單資料
  const { name, email, password, confirmPassword } = req.body
  //檢查是否註冊
  User.findOne({ email }).then(user => {
    //如果已經註冊，就返回頁面
    if (user){
      console.log('User already register')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword
      }) 
    } else {
        return User.create({
          name, 
          email,
          password
        })
          .then(() => res.render('/'))
          .catch(error => console.log(error))
    }
  })
  .catch(error => console.log(error))
})



module.exports = router