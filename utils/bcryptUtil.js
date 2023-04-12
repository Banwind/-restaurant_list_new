//加密功能的檔案
const bcrypt = require('bcryptjs')

exports.comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}

exports.hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err)
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return reject(err)
        }
        resolve(hash)
      })
    })
  })
}