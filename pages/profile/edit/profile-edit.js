import { linkWeChat, UserModel, AV } from '../../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    userInfo: null,
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  changeAvatar: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let userCopy = JSON.parse(JSON.stringify(this.data.userInfo))
        new AV.File(userCopy.id, {
          blob: { uri: res.tempFilePaths[0], },
        }).save().then(file => {
          userCopy.avatarUrl = file.url()
          UserModel.update(['avatarUrl'], userCopy, () => {
            this.setData({
              userInfo: userCopy
            })
            app.globalData.userInfo = userCopy
          }, (error) => {
            wx.showToast({
              title: error,
              icon: 'none'
            })
          })
        }).catch(console.error)
      }
    })
  },
  changeData: function ({ detail: { value } }) {
    let userCopy = JSON.parse(JSON.stringify(this.data.userInfo))
    userCopy.username = value
    if (userCopy.username) {
      this.setData({
        userInfo: userCopy,
      })
    }
  },
  changeName: function ({ detail: { value } }) {
    let userCopy = JSON.parse(JSON.stringify(this.data.userInfo))
    if (value.trim() === '') {
      userCopy.username = '勾勾用户'
      this.setData({
        userInfo: userCopy,
      })
    }
    UserModel.update(['username'], this.data.userInfo, () => {
      app.globalData.userInfo = this.data.userInfo
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
  },
  showEmailSettingWindow: function () {
    this.setData({ linkEmailNeeded: true })
  },
  cancelLinkEmail: function () {
    this.setData({ linkEmailNeeded: false })
  },
  nextSetPassword: function () {
    this.setData({ transformValue: 'translateX(-50%)' })
  },
  previousSetEmail: function () {
    this.setData({ transformValue: 'translateX(0%)' })
  },
  linkEmail: function ({ detail: { value: { email, password } } }) {
    let index_at = email.indexOf('@'),
      index_point = email.indexOf('.'),
      length_strAfterPoint = email.substr(index_point + 1).length

    if (email.indexOf(' ') > -1 || email === '') {
      wx.showModal({
        title: '邮箱不能为空或含有空格！',
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
        }
      })
    } else {
      let user = AV.User.current()
      user.setEmail(email).setPassword(password).save().then((user) => {
        console.log(user)
        app.globalData.userInfo.email = email
        this.setData({
          userInfo: app.globalData.userInfo,
          linkEmailNeeded: false,
          transformValue: 'translateX(0%)'
        })
        console.log(this.data)
        wx.showModal({
          title: '验证邮件已发送',
          content: `验证邮件已发送至您的邮箱【${email}】，请转至邮箱通过验证即可邮箱和密码登录使用。`,
          showCancel: false,
          confirmText: '知道了'
        })
      }, (error) => {
        wx.showToast({
          title: error.code.toString(),
          icon: 'none'
        })
      })
    }
  },
  linkWeChat: function ({ detail }) {
    if (detail.errMsg === 'getUserInfo:ok') {
      linkWeChat().then(() => {
        app.globalData.userInfo.weAppName = detail.userInfo.nickName
        app.globalData.userInfo.weAppLinked = true
        UserModel.update(['weAppName', 'weAppLinked'], app.globalData.userInfo, () => {
          this.setData({
            userInfo: app.globalData.userInfo,
          })
        }, (error) => {
          wx.showToast({
            title: error,
            icon: 'none'
          })
        })
      })
    }
  }
})