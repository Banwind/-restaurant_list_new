const restaurants = require('../restaurant_list') // 載入 Restaurant model
const restaurantsList = require('../../restaurant.json').results
const db = require('../../config/mongoose')
const User = require('../user')
const userList = require('../../user.json').results
const bcryptUtil = require('../../utils/bcryptUtil')

//利用非同步處理
db.once('open', async () => {
  try {
    userList[0].password = await bcryptUtil.hashPassword(userList[0].password)
    userList[1].password = await bcryptUtil.hashPassword(userList[1].password)

    const user1 = await User.create( {...userList[0]} )
    for (let i=0; i<3; i++) {
      await restaurants.create({...restaurantsList[i], userId: user1._id})
    }

    const user2 = await User.create({ ...userList[1] })
    for (let i = 3; i<6; i++) {
      await restaurants.create({ ...restaurantsList[i], userId: user2._id })
    }
    
    db.close()
  } catch (err) {
    console.log(err)
  }
})