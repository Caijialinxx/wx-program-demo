const app = getApp()
import { logIn } from '../../utils/leancloud.js'

Page({
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.navigateBack({
      delta: 1
    })
  },
  verifyInfo: function (e) {
    let { email, password } = e.detail.value,
      index_at = email.indexOf('@'),
      index_point = email.indexOf('.'),
      length_strAfterPoint = email.substr(index_point + 1).length

    if (email.trim() === '') {
      wx.showModal({
        title: '邮箱不能为空',
        content: '请输入您注册的邮箱，如未注册，请先注册或使用微信快捷登录。',
        showCancel: false,
      })
    } else if (password.trim() === '') {
      wx.showModal({
        title: '密码不能为空',
        content: '',
        showCancel: false,
      })
    } else if (index_at < 1 || index_point < index_at + 2 || length_strAfterPoint < 2) {
      wx.showModal({
        title: '电子邮箱无效',
        content: '请输入正确的电子邮箱地址！',
        showCancel: false,
      })
    } else {
      logIn(email, password, (user) => {
        app.globalData.userInfo = user
        wx.navigateBack({
          delta: 1
        })
      }, (error) => {
        wx.showToast({
          title: error,
          icon: 'none'
        })
      })
    }
  }
})