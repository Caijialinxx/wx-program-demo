const app = getApp()

Page({
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.navigateBack({
      delta: 1
    })
  },
})