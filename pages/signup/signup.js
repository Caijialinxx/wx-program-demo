import { signUp } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    email: '',
    nickname: '',
    password: '',
    password_confirm: ''
  },
  changeData: function(e) {
    switch (e.currentTarget.dataset.target) {
      case 'email':
        this.setData({ email: e.detail.value })
        break
      case 'nickname':
        this.setData({ nickname: e.detail.value })
        break
      case 'password':
        this.setData({ password: e.detail.value })
        break
      default:
        this.setData({ password_confirm: e.detail.value })
        break
    }
  },
  verifyInfo: function({
    detail: { value: { email, nickname, password, password_confirm } }
  }) {
    let index_at = email.indexOf('@'),
      index_point = email.indexOf('.'),
      length_strAfterPoint = email.substr(index_point + 1).length

    if (email.indexOf(' ') > -1 || email === '') {
      wx.showModal({
        title: '邮箱不能为空或含有空格！',
        showCancel: false,
      })
    } else if (nickname.indexOf(' ') > -1 || nickname === '') {
      wx.showModal({
        title: '昵称不能为空或含有空格！',
        showCancel: false,
      })
    } else if (index_at < 1 || index_point < index_at + 2 || length_strAfterPoint < 2) {
      wx.showModal({
        title: '邮箱格式错误！',
        showCancel: false,
      })
    } else if (password.indexOf(' ') > -1 || password === '') {
      wx.showModal({
        title: '密码不能为空或含有空格！',
        showCancel: false,
        success: () => {
          this.setData({
            password: '',
            password_confirm: ''
          })
          console.log(this.data)
        }
      })
    } else if (password !== password_confirm) {
      wx.showModal({
        title: '两次输入的密码不一致！',
        showCancel: false,
        success: () => {
          this.setData({
            password: '',
            password_confirm: ''
          })
        }
      })
    } else {
      signUp(email, nickname, password, (user) => {
        app.globalData.userInfo = user
        wx.showModal({
          title: '验证邮件已发送',
          content: `已向你的邮箱【${email.trim()}】发送验证邮件，请转至邮箱查收并进行验证！`,
          showCancel: false,
          success: () => {
            wx.navigateBack({
              delta: 1
            })
          }
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