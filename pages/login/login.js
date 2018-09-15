const app = getApp()
import { logIn, reset } from '../../utils/leancloud.js'

Page({
  data: {
    email: '',
    password: ''
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({ email: app.globalData.userInfo.email })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.navigateBack({
      delta: 1
    })
  },
  changeData: function (e) {
    switch (e.currentTarget.dataset.target) {
      case 'email':
        this.setData({ email: e.detail.value })
        break
      case 'password':
        this.setData({ password: e.detail.value })
        break
      default:
        return
    }
  },
  verifyInfo: function ({ detail: { value: { email, password } } }) {
    let index_at = email.indexOf('@'),
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
  },
  resetPassword: function () {
    let email = this.data.email
    if (email) {
      wx.showModal({
        title: '重置密码',
        content: `我们将会向您的邮箱【${email}】发送重置密码的邮件，一旦设置成功，旧密码就会失效，您需要通过新密码重新登录。`,
        success: ({ confirm }) => {
          if (confirm) {
            let success = () => {
              wx.showToast({
                title: '重置密码邮件已发送，请转至邮箱查收！',
                icon: 'none'
              })
            },
              error = (error) => {
                wx.showToast({
                  title: error,
                  icon: 'none'
                })
              }
            reset(email, success, error)
          }
        }
      })
    } else {
      wx.showModal({
        title: '请输入电子邮箱地址',
        content: '请在登录页面的电子邮箱输入框中输入电子邮箱地址，然后再点击忘记密码。',
        showCancel: false
      })
    }
  }
})