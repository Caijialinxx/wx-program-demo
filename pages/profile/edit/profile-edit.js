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