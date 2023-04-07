const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passReqToCallback: true, // 設定為 true，讓 req 物件可傳入 callback 中
    failureFlash: true // 加上這行，當驗證失敗時會自動將錯誤訊息存入 session 
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error', '找不到此用戶信箱'))
        }
        if (user.password !== password) {
          return done(null, false, req.flash('error', '帳號或密碼錯誤!'))
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user)) 
      .catch(err => done(err, null)) 
  })
}