import { logOut } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    userInfo: null,
  },
  onShow: function() {
    if (!this.data.userInfo && app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  logout: function() {
    this.setData({
      userInfo: logOut()
    })
    app.globalData.userInfo = null
  }
})