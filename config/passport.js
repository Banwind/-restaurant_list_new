const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
// const bcrypt = require('bcryptjs')
const bcryptUtil = require('../utils/bcryptUtil')
const FacebookStrategy = require('passport-facebook').Strategy

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
          return done(null, false, req.flash('error', '找不到此用戶信箱!'))
        }
        return bcryptUtil.comparePassword(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, req.flash('error', '密碼錯誤!'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  //設定FB登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.finOne({ email })
      .then(user => {
        if (user) return done(null, user)
        // Math.random() - 先用產生一個 0-1 的隨機小數，例如 0.3767988078359976
        // toString(36) - 運用進位轉換將小數變成英數參雜的亂碼 此時的回傳結果可能是 '0.dkbxb14fqq4'。
        // slice(-8) - 最後，截切字串的最後一段，得到八個字母，例如 'xb14fqq4'
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))        
      })
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