import { logOut } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    userInfo: null,
  },
  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  clearStorage: function() {
    wx.clearStorage({
      success: () => {
        wx.showToast({
          title: '清理成功',
        })
      }
    })
  },
  logout: function() {
    this.setData({
      userInfo: logOut()
    })
    app.globalData.userInfo = null
  }
})