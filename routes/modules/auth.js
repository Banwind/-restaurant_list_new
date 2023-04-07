const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'] // 設定使用者授權時需要開放的權限範圍
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router